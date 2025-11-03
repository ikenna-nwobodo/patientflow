import type { Patient } from "../types/patient";

interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
  onPredict: () => void;
}

export default function PatientCard({
  patient,
  onEdit,
  onDelete,
  onPredict,
}: PatientCardProps) {
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
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            patient.status
          )}`}
        >
          {getStatusLabel(patient.status)}
        </span>
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
