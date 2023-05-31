import { Router } from "express";
import {
  deleteEventsByRegattaId,
  deleteRegattaById,
  getEventsByRegattaId,
  getRegattaById,
  getRegattas,
  postEventByRegattaId,
  postRegatta,
  updateRegattaById,
} from "./regattaController";

const router = Router();

//  No regatta ID
router
  .route("/")
  .get(getRegattas) //  get all regattas
  .post(postRegatta); //  create new regatta

//  Regatta ID
router
  .route("/:regattaId")
  .get(getRegattaById) //  get single regatta
  .put(updateRegattaById) //  update single regatta
  .delete(deleteRegattaById); //  delete single regatta with referential records

//  No event ID
router
  .route("/:regattaId/events")
  .get(getEventsByRegattaId) //  get all events from single regatta
  .post(postEventByRegattaId) //  create new event for single regatta
  .delete(deleteEventsByRegattaId); //  delete all events for single regatta

//  Event ID
router
  .route("/:regattaId/events/:eventId")
  .put() //  update event for single regatta
  .delete(); //  delete single event for single regatta

export default router;
