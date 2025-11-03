import type { Patient } from "../types/patient";
import PatientCard from "./PatientCard";

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onPredict: (id: string) => void;
  onUpdate: () => void;
}

export default function PatientList({
  patients,
  onEdit,
  onDelete,
  onPredict,
  onUpdate,
}: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">No patients found</p>
        <p className="text-gray-400 text-sm mt-2">
          Add a new patient to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {patients.map((patient) => (
        <PatientCard
          key={patient._id}
          patient={patient}
          onEdit={() => onEdit(patient)}
          onDelete={() => onDelete(patient._id)}
          onPredict={() => onPredict(patient._id)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
