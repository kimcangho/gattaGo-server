import { Router } from "express";
import {
  getAllUserTeams,
  createUserTeam,
  getSingleTeamByID,
  updateSingleTeamByID,
  deleteSingleTeamByID,
  getAllRegattasRegisteredTo,
  deleteTeamFromRegattas,
  getAllTeamEventsByRegattaID,
  getAllAthletesByTeamID,
  deleteAllAthletesByTeamID,
  addAthleteToTeamByID,
  deleteAthleteFromTeamByID,
  getAllTeamLineups,
  getSingleTeamLineup,
  deleteAllTeamLineups,
  deleteSingleLineup,
  postNewTeamLineup,
  updateSingleLineup,
  getTeamDashboardDetails,
} from "../controllers/team.controller";

const router: Router = Router();

//  User ID
router
  .route("/user/:userId")
  .get(getAllUserTeams) //  get all teams from database by userID
  .post(createUserTeam); //  create single team for user with userID

//  Team ID
router
  .route("/:teamId")
  .get(getSingleTeamByID) //  get single team
  .put(updateSingleTeamByID) //  update single team name
  .delete(deleteSingleTeamByID); //  delete single team

//  No Regatta ID
router
  .route("/:teamId/regattas")
  .get(getAllRegattasRegisteredTo) //  get all regattas team is registered to
  .delete(deleteTeamFromRegattas); // withdraw team from all regattas

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

//  No Lineup ID
router
  .route("/:teamId/lineups")
  .get(getAllTeamLineups) //  get all team lineups
  .post(postNewTeamLineup) //  create new team lineup
  .delete(deleteAllTeamLineups); //  delete all team lineups

//  Lineup ID
router
  .route("/:teamId/lineups/:lineupId")
  .get(getSingleTeamLineup) //  get single lineup
  .put(updateSingleLineup) //  update single lineup
  .delete(deleteSingleLineup); //  delete single lineup

//  Dashboard Specifics
router.route("/:teamId/dashboard").get(getTeamDashboardDetails);  //  get dashboard specs for team

export default router;
