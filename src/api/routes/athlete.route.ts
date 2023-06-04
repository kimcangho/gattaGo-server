import { Router } from "express";
import {
  deleteAthleteByID,
  getAthleteByID,
  postNewAthlete,
  updateAthleteByID,
} from "../controllers/athlete.controller";

const router: Router = Router();

//  *** Athlete Requests ***

//  No Athlete ID
router.route("/").post(postNewAthlete); //  create new athlete

//  Athlete ID
router
  .route("/:athleteId")
  .get(getAthleteByID) //  get individual athlete
  .put(updateAthleteByID) //  update individual athlete details
  .delete(deleteAthleteByID); //  delete athlete from database

export default router;
