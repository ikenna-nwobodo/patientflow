import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PatientPage from "./pages/Patient";

const App = () => (
  <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patientlist" element={<PatientPage />} />
    </Routes>
  </div>
);
export default App;
