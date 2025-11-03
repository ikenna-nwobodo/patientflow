export interface VitalSigns {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
}

export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  admissionDate: string;
  diagnosis: string;
  vitalSigns: VitalSigns;
  status: "admitted" | "ready_for_review" | "discharged";
  dischargeReadinessScore?: number;
  lengthOfStay: number;
  dischargeDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalPatients: number;
  admittedCount: number;
  readyForReview: number;
  dischargedCount: number;
  avgLengthOfStay: number;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  age: number;
  diagnosis: string;
  vitalSigns: VitalSigns;
  notes?: string;
}
