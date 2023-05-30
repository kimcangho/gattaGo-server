import { Router } from "express";
import {
  deleteRegattaById,
  getRegattaById,
  getRegattas,
  postRegatta,
  updateRegattaById,
} from "./regattaController";

const router = Router();
router
  .route("/")
  .get(getRegattas) //  get all regattas
  .post(postRegatta); //  create new regatta

router
  .route("/:regattaId")
  .get(getRegattaById) //  get single regatta
  .put(updateRegattaById) //  update single regatta
  .delete(deleteRegattaById); //  delete single regatta with referential records

export default router;
