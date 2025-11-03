import { useState } from "react";
import type { Patient } from "../types/patient";
import patientApi from "../services/api";

interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
  onPredict: () => void;
  onUpdate: () => void;
}

export default function PatientCard({
  patient,
  onEdit,
  onDelete,
  onPredict,
  onUpdate,
}: PatientCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "admitted":
        return "bg-yellow-100 text-yellow-800";
      case "ready_for_review":
        return "bg-green-100 text-green-800";
      case "discharged":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "admitted":
        return "Admitted";
      case "ready_for_review":
        return "Ready for Review";
      case "discharged":
        return "Discharged";
      default:
        return status;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = { status: newStatus };

      // If marking as discharged, set discharge date
      if (newStatus === "discharged" && !patient.dischargeDate) {
        updateData.dischargeDate = new Date().toISOString();
      }

      await patientApi.updatePatient(patient._id, updateData);
      setShowStatusMenu(false);
      onUpdate();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {patient.firstName} {patient.lastName}
          </h3>
          <p className="text-sm text-gray-500">{patient._id}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            disabled={updating}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              patient.status
            )} cursor-pointer hover:opacity-80 transition`}
          >
            {updating ? "Updating..." : getStatusLabel(patient.status)}
          </button>

          {/* Status dropdown menu */}
          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => handleStatusChange("admitted")}
                className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-sm rounded-t-lg"
              >
                ✓ Admitted
              </button>
              <button
                onClick={() => handleStatusChange("ready_for_review")}
                className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm"
              >
                ✓ Ready for Review
              </button>
              <button
                onClick={() => handleStatusChange("discharged")}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm rounded-b-lg"
              >
                ✓ Discharged
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Age</p>
          <p className="text-sm font-medium text-gray-800">
            {patient.age} years
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Length of Stay</p>
          <p className="text-sm font-medium text-gray-800">
            {patient.lengthOfStay} days
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Admission Date</p>
          <p className="text-sm font-medium text-gray-800">
            {formatDate(patient.admissionDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Diagnosis</p>
          <p className="text-sm font-medium text-gray-800">
            {patient.diagnosis}
          </p>
        </div>
      </div>

      {/* Discharge Date (if discharged) */}
      {patient.dischargeDate && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500">Discharge Date</p>
          <p className="text-sm font-medium text-gray-800">
            {formatDate(patient.dischargeDate)}
          </p>
        </div>
      )}

      {/* Vital Signs */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">Vital Signs</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Temp</p>
            <p className="font-medium">{patient.vitalSigns.temperature}°C</p>
          </div>
          <div>
            <p className="text-gray-500">BP</p>
            <p className="font-medium">{patient.vitalSigns.bloodPressure}</p>
          </div>
          <div>
            <p className="text-gray-500">HR</p>
            <p className="font-medium">{patient.vitalSigns.heartRate} bpm</p>
          </div>
        </div>
      </div>

      {/* Discharge Readiness Score */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <p className="text-xs text-gray-500">Discharge Readiness Score</p>
          {patient.dischargeReadinessScore !== null && (
            <span
              className={`text-lg font-bold ${getScoreColor(
                patient.dischargeReadinessScore
              )}`}
            >
              {patient.dischargeReadinessScore}%
            </span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              patient.dischargeReadinessScore
                ? patient.dischargeReadinessScore >= 70
                  ? "bg-green-600"
                  : patient.dischargeReadinessScore >= 40
                  ? "bg-yellow-600"
                  : "bg-red-600"
                : "bg-gray-300"
            }`}
            style={{ width: `${patient.dischargeReadinessScore || 0}%` }}
          />
        </div>
        {!patient.dischargeReadinessScore && (
          <p className="text-xs text-gray-400 mt-1">No prediction yet</p>
        )}
      </div>

      {/* Notes */}
      {patient.notes && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Notes</p>
          <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
            {patient.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onPredict}
          disabled={patient.status === "discharged"}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          🤖 Predict
        </button>
        <button
          onClick={onEdit}
          className="flex-1 bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 transition text-sm"
        >
          ✏️ Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white py-2 px-3 rounded hover:bg-red-700 transition text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
