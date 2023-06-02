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

export default router;
