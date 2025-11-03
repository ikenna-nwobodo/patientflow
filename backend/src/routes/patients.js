import { Router } from "express";
const router = Router();
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  predictDischarge,
} from "../controllers/patientController.js";

router.route("/").get(getAllPatients).post(createPatient);

router
  .route("/:id")
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

router.post("/:id/predict", predictDischarge);

export default router;
