import { Router } from "express";
import {
  getAllTeams,
  createTeam,
  getSingleTeamByID,
  updateSingleTeamByID,
  deleteSingleTeamByID,
} from "./teamController";

const router: Router = Router();

//  No Team ID
router
  .route("/")
  .get(getAllTeams) //  get all teams from database
  .post(createTeam); //  create single team

//  Team ID
router
  .route("/:teamId")
  .get(getSingleTeamByID) //  get single team
  .put(updateSingleTeamByID) //  update single team
  .delete(deleteSingleTeamByID); //  delete single team

export default router;
