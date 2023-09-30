import { Router } from "express";
import {
  getAllUserTeams,
  createUserTeam,
  getSingleTeamByID,
  updateSingleTeamByID,
  deleteSingleTeamByID,
  getAllAthletesByTeamID,
  // deleteAllAthletesByTeamID,
  addAthleteToTeamByID,
  deleteAthleteFromTeamByID,
  getAllTeamLineups,
  getSingleTeamLineup,
  // deleteAllTeamLineups,
  deleteSingleLineup,
  postNewTeamLineup,
  updateSingleLineup,
  getTeamDashboardDetails,
  generateUserTeamAthletesLineups,
  getRacePlans,
  createRacePlan,
  updateRacePlan,
  deleteRacePlan,
  getSingleRacePlan,
} from "../controllers/team.controller";

const router: Router = Router();

//  User ID
router
  .route("/user/:userId")
  .get(getAllUserTeams) //  get all teams from database by userID
  .post(createUserTeam); //  create single team for user with userID

router
  .route("/user/:userId/generateFullTeam")
  .post(generateUserTeamAthletesLineups); //  create single team for user with userID

//  Team ID
router
  .route("/:teamId")
  .get(getSingleTeamByID) //  get single team
  .put(updateSingleTeamByID) //  update single team name
  .delete(deleteSingleTeamByID); //  delete single team

//  No Athlete ID
router.route("/:teamId/athletes").get(getAllAthletesByTeamID); //  get all team athletes

//  Athlete ID
router
  .route("/:teamId/athletes/:athleteId")
  .post(addAthleteToTeamByID) //  add athlete to team
  .delete(deleteAthleteFromTeamByID); //  delete athlete from team

//  No Lineup ID
router
  .route("/:teamId/lineups")
  .get(getAllTeamLineups) //  get all team lineups
  .post(postNewTeamLineup); //  create new team lineup

//  Lineup ID
router
  .route("/:teamId/lineups/:lineupId")
  .get(getSingleTeamLineup) //  get single lineup
  .put(updateSingleLineup) //  update single lineup
  .delete(deleteSingleLineup); //  delete single lineup

//  Dashboard Specifics
router.route("/:teamId/dashboard").get(getTeamDashboardDetails); //  get dashboard specs for team

//  Race Day Plans - No ID
router.route("/:teamId/racePlans/").get(getRacePlans).post(createRacePlan);

//  Race Day Plans - ID
router
  .route("/:teamId/racePlans/:racePlanId")
  .get(getSingleRacePlan)
  .put(updateRacePlan)
  .delete(deleteRacePlan);

export default router;
