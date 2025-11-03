import { Schema, model } from "mongoose";

const patientSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    admissionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    vitalSigns: {
      temperature: {
        type: Number,
        default: 37.0,
      },
      bloodPressure: {
        type: String,
        default: "120/80",
      },
      heartRate: {
        type: Number,
        default: 75,
      },
    },
    status: {
      type: String,
      enum: ["admitted", "ready_for_review", "discharged"],
      default: "admitted",
    },
    dischargeReadinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    dischargeDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

patientSchema.virtual("lengthOfStay").get(function () {
  const end = this.dischargeDate || new Date();
  const diffTime = Math.abs(end - this.admissionDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

patientSchema.set("toJSON", { virtuals: true });
patientSchema.set("toObject", { virtuals: true });

const Patient = model("Patient", patientSchema);
export default Patient;
