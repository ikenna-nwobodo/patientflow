import { useState, type FormEvent } from "react";
import type { Patient, PatientFormData } from "../types/patient";
import { patientApi } from "../services/api";

interface PatientFormProps {
  patient: Patient | null;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PatientForm({
  patient,
  onSubmit,
  onCancel,
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: patient?.firstName || "",
    lastName: patient?.lastName || "",
    age: patient?.age || 0,
    diagnosis: patient?.diagnosis || "",
    vitalSigns: {
      temperature: patient?.vitalSigns.temperature || 37.0,
      bloodPressure: patient?.vitalSigns.bloodPressure || "120/80",
      heartRate: patient?.vitalSigns.heartRate || 75,
    },
    notes: patient?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("vitalSigns.")) {
      const vitalKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        vitalSigns: {
          ...prev.vitalSigns,
          [vitalKey]:
            vitalKey === "bloodPressure" ? value : parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "age" ? parseInt(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (patient) {
        await patientApi.updatePatient(patient._id, formData);
      } else {
        await patientApi.createPatient(formData);
      }
      onSubmit();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {patient ? "Edit Patient" : "Add New Patient"}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="0"
              max="150"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis *
            </label>
            <input
              type="text"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Vital Signs */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Vital Signs
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="vitalSigns.temperature"
                value={formData.vitalSigns.temperature}
                onChange={handleChange}
                step="0.1"
                min="30"
                max="45"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Pressure
              </label>
              <input
                type="text"
                name="vitalSigns.bloodPressure"
                value={formData.vitalSigns.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                name="vitalSigns.heartRate"
                value={formData.vitalSigns.heartRate}
                onChange={handleChange}
                min="30"
                max="200"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes about the patient..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : patient ? "Update Patient" : "Add Patient"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
