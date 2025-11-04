import { useEffect, useState } from "react";
import type { Patient } from "../types/patient";
import { patientApi } from "../services/api";

const PatientPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  // const [statusFilter, setStatusFilter] = useState<string>("");
  // const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const patientList = await patientApi.getAllPatients();
      setPatients(patientList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchStats = async () => {
  //   try {
  //     const data = await patientApi.getStats();
  //     setStats(data);
  //   } catch (error) {
  //     console.error("Error fetching stats:", error);
  //   }
  // };

  useEffect(() => {
    fetchPatients();
    // fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">PatientFlow</h1>
              <p className="text-sm text-gray-500">
                Healthcare Patient Management System
              </p>
            </div>
            <button
              // onClick={handleAddPatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Patient
            </button>
          </div>
        </div>
      </header>
      <div className="bg-red-700 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        ) : (
          <div>
            <h2>Patient List</h2>
            <ul>
              {patients.map((patient) => {
                return (
                  <li key={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPage;
