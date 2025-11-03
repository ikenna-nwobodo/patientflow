import Patient from "../models/patient.js";
import axios from "axios";

// get all patients
export async function getAllPatients(req, res, next) {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
      ];
    }

    const patients = await Patient.find(query).sort({ admissionDate: -1 });
    res
      .status(200)
      .json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
}

// get signle patient
export async function getPatientById(req, res, next) {
  try {
    const patient = await Patient.findById({ patientId: req.params.id });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
}

// create new patient
export async function createPatient(req, res, next) {
  try {
    const count = await Patient.countDocuments();
    const patientId = `PT-${(count + 1).toString().padStart(4, "0")}`;

    const newPatient = new Patient({ patientId, ...req.body });

    await newPatient.save();

    res.status(201).json({ success: true, data: newPatient });
  } catch (error) {
    next(error);
  }
}

// update patient
export async function updatePatient(req, res, next) {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
}

// delete patient
export async function deletePatient(req, res, next) {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({ success: true, message: "Patient deleted" });
  } catch (error) {
    next(error);
  }
}

// get ml prediction
export async function predictDischarge(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    const end = patient.dischargeDate
      ? new Date(patient.dischargeDate)
      : new Date();
    const diffTime = Math.abs(end - patient.admissionDate);
    const lengthOfStay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const mlServoceUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

    console.log("Calling ML Service:", mlServoceUrl);

    const payload = {
      age: patient.age,
      diagnosis: patient.diagnosis,
      temperature: parseFloat(patient.vitalSigns.temperature),
      heartRate: parseInt(patient.vitalSigns.heartRate),
      lengthOfStay: patient.lengthOfStay,
    };

    console.log("Payload sent to ML Service:", payload);

    const response = await axios.post(`${mlServoceUrl}/predict`, payload, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("ML Service Response:", response.data);

    patient.dischargeReadinessScore = response.data.score;

    if (response.data.score >= 70) {
      patient.status = "ready_for_review";
    }

    await patient.save();

    res
      .status(200)
      .json({ success: true, data: patient, prediction: response.data });
  } catch (error) {
    console.error("ML Service Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    res.status(500).json({
      success: false,
      message: "Could not get prediction. ML service may be down.",
    });
  }
}
