import { Router } from "express";
import {
  getAllTeams,
  createTeam,
  getSingleTeamByID,
  updateSingleTeamByID,
  deleteSingleTeamByID,
  getAllRegattasRegisteredTo,
  withdrawTeamFromRegattas,
  getAllTeamEventsByRegattaID,
  getAllAthletesByTeamID,
  deleteAllAthletesByTeamID,
  addAthleteToTeamByID,
  deleteAthleteFromTeamByID,
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

//  No Regatta ID
router
  .route("/:teamId/regattas")
  .get(getAllRegattasRegisteredTo) //  get all regattas team is registered to
  .delete(withdrawTeamFromRegattas); // withdraw team from all regattas

//  Regatta ID
router.route("/:teamId/events/:regattaId").get(getAllTeamEventsByRegattaID); //  get all events team registered to

//  No Athlete ID
router
  .route("/:teamId/athletes")
  .get(getAllAthletesByTeamID) //  get all team athletes
  .delete(deleteAllAthletesByTeamID); //  remove all athletes from team

//  Athlete ID
router
  .route("/:teamId/athletes/:athleteId")
  .post(addAthleteToTeamByID) //  add athlete to team
  .delete(deleteAthleteFromTeamByID); //  delete athlete from team

export default router;
