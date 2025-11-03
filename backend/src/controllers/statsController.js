import Patient from "../models/patient.js";

export async function getStats(req, res, next) {
  try {
    const totalPatients = await Patient.countDocuments();
    const admittedCount = await Patient.countDocuments({ status: "admitted" });
    const readyForReview = await Patient.countDocuments({
      status: "ready_for_review",
    });
    const dischargedCount = await Patient.countDocuments({
      status: "discharged",
    });

    const patients = await Patient.find().lean();

    let avgLengthOfStay = 0;
    if (patients.length > 0) {
      const totalLOS = patients.reduce((sum, p) => {
        const end = p.dischargeDate ? new Date(p.dischargeDate) : new Date();
        const diffTime = Math.abs(end - new Date(p.admissionDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0);
      avgLengthOfStay = parseFloat((totalLOS / patients.length).toFixed(1));
    }
    // const totalLOS = patients.reduce((sum, p) => sum + p.lengthOfStay, 0);
    // const avgLengthOfStay =
    //   patients.length > 0 ? (totalLOS / patients.length).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        totalPatients,
        admittedCount,
        readyForReview,
        dischargedCount,
        avgLengthOfStay,
      },
    });
  } catch (error) {
    next(error);
  }
}
