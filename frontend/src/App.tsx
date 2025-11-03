import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import type { Patient, Stats } from "./types/patient";
import { patientApi } from "./services/api";

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientApi.getAllPatients(statusFilter, searchQuery);
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await patientApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchStats();
  }, [statusFilter, searchQuery]);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await patientApi.deletePatient(id);
        fetchPatients();
        fetchStats();
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const handlePredictDischarge = async (id: string) => {
    try {
      await patientApi.predictDischarge(id);
      fetchPatients();
      fetchStats();
      alert("Discharge prediction updated successfully!");
    } catch (error) {
      console.error("Error predicting discharge:", error);
      alert("Could not get prediction. ML service may be unavailable.");
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingPatient(null);
    fetchPatients();
    fetchStats();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              onClick={handleAddPatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Patient
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        {stats && <Dashboard stats={stats} />}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="admitted">Admitted</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
        </div>

        {/* Patient List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading patients...</p>
          </div>
        ) : (
          <PatientList
            patients={patients}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onPredict={handlePredictDischarge}
          />
        )}

        {/* Patient Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <PatientForm
                patient={editingPatient}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
