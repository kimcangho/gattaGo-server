import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const {
  regatta,
  team,
  lineup,
  athletesInTeams,
  teamsInRegattas,
  teamsInEvents,
  athletesInLineups,
} = new PrismaClient();

//  *** Team Requests ***

//  No team ID

//  get all teams from teams table
const getAllTeams = async (_req: Request, res: Response) => {
  const foundTeams = await team.findMany();

  if (foundTeams) return res.json(foundTeams);
  res.send({ msg: "No teams found" }).status(404);
};

//  create new team
const createTeam = async (req: Request, res: Response) => {
  const { name, division, level, gender } = req.body;

  await team.create({
    data: {
      name,
      division,
      level,
      gender,
    },
  });

  res.send({ msg: "Successfully created new team!" }).status(204);
};

//  Team ID

//  get single team
const getSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(404);

  res.send(checkedTeam).status(200);
};

//  update single team
const updateSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId, name, division, level, gender } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(404);

  await team.update({
    where: {
      id: teamId,
    },
    data: {
      name,
      division,
      level,
      gender,
    },
  });

  res.send({ msg: `Successfully updated team ${teamId}` });
};

//  delete single team from teams table
const deleteSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(204);

  const athletesInTeam = await athletesInTeams.findMany({
    where: { teamId },
  });

  for (let athleteUnit of athletesInTeam) {
    await athletesInLineups.deleteMany({
      where: {
        athleteId: athleteUnit.athleteId,
      },
    });
  }

  await athletesInTeams.deleteMany({
    where: {
      teamId,
    },
  });

  await teamsInRegattas.deleteMany({
    where: {
      teamId,
    },
  });

  await teamsInEvents.deleteMany({
    where: {
      teamId,
    },
  });

  await lineup.deleteMany({
    where: {
      teamId,
    },
  });

  await team.delete({
    where: {
      id: teamId,
    },
  });

  res.send({ msg: `Successfully deleted team ${teamId}!` }).status(204);
};

//  No regatta ID
const getAllRegattasRegisteredTo = async (req: Request, res: Response) => {
  const { teamId } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(204);

  const registeredRegattas = await teamsInRegattas.findMany({
    where: {
      teamId,
    },
  });
  res.send(registeredRegattas).status(200);
};

const withdrawTeamFromRegattas = async (req: Request, res: Response) => {
  const { teamId } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(204);

  await teamsInRegattas.deleteMany({
    where: {
      teamId,
    },
  });

  res.send({ msg: `Team ${teamId} withdrawn from all regattas!` });
};

//  Regatta ID
const getAllTeamEventsByRegattaID = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(404);

  //    Get all events in regatta containing team

  const foundTeamEvents = await teamsInEvents.findMany({
    where: {
      teamId,
    },
  });
  if (foundTeamEvents.length === 0)
    return res.send({
      msg: `Team ${teamId} not in any events within regatta ${regattaId}`,
    });

  res.send(foundTeamEvents).status(200);
};

//  No Athlete ID
const getAllAthletesByTeamID = async (req: Request, res: Response) => {
  const { teamId } = req.body;
  if (!teamId) return res.send({ msg: `Please include teamId!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam) return res.send({ msg: `Team ${teamId} not found!` });

  const foundTeamAthletes = await athletesInTeams.findMany({
    where: {
      teamId,
    },
  });
  if (foundTeamAthletes.length === 0)
    return res.send({ msg: `No athletes in team ${teamId}!` });

  res.send(foundTeamAthletes);
};

const deleteAllAthletesByTeamID = async (req: Request, res: Response) => {
  const { teamId } = req.body;
  if (!teamId) return res.send({ msg: `Please include teamId!` });

  if (!teamId) return res.send({ msg: `Please include teamId!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  await athletesInTeams.deleteMany({
    where: {
      teamId,
    },
  });

  res.send({ msg: `Athletes removed from team ${teamId}` }).status(204);
};

//  Athlete ID
const addAthleteToTeamByID = async (req: Request, res: Response) => {
  const { teamId, athleteId } = req.body;
  if (!teamId || !athleteId)
    return res.send({ msg: `Please include teamId and athleteId!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);
};

const deleteAthleteFromTeamByID = async (req: Request, res: Response) => {
  const { teamId, athleteId } = req.body;
  if (!teamId || !athleteId)
    return res.send({ msg: `Please include teamId and athleteId!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  await athletesInLineups.deleteMany({
    where: {
      athleteId,
    },
  });

  await athletesInTeams.deleteMany({
    where: {
      athleteId,
      teamId,
    },
  });

  res.send({ msg: `Successfully delete athlete ${athleteId} from ${teamId}!` });
};

//  No Lineup ID
const getAllTeamLineups = async (req: Request, res: Response) => {
  const { teamId } = req.body;
  if (!teamId) return res.send({ msg: `Please include teamid!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  const foundTeamLineups = await team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      lineups: {
        include: {
          athletes: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  res.send(foundTeamLineups).status(201);
};

const postNewTeamLineup = async (req: Request, res: Response) => {
  const { teamId, athletes, name } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  const newLineup = await lineup.create({
    data: {
      name,
      teamId,
    },
  });

  for (let athleteUnit of athletes) {
    console.log(athleteUnit);

    await athletesInLineups.create({
      data: {
        lineupId: newLineup.id,
        athleteId: athleteUnit.id,
        position: athleteUnit.position,
      },
    });
  }

  res.send({ msg: `New lineup ${lineup} created and populated!` });
};

const deleteAllTeamLineups = async (req: Request, res: Response) => {
  const { teamId } = req.body;
  if (!teamId) return res.send({ msg: `Please include teamid!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  const foundLineupIDs = await lineup.findMany({
    where: {
      teamId,
    },
    select: {
      id: true,
    },
  });

  for (let lineupUnit of foundLineupIDs) {
    await athletesInLineups.deleteMany({
      where: {
        lineupId: lineupUnit.id,
      },
    });
  }

  await lineup.deleteMany({
    where: {
      teamId,
    },
  });

  res
    .send({ msg: `Successfully deleted lineups from team ${teamId}!` })
    .status(204);
};

//  Lineup ID
const getSingleTeamLineup = async (req: Request, res: Response) => {
  const { teamId, lineupId } = req.body;
  if (!teamId || !lineupId)
    return res.send({ msg: `Please include teamId and lineupId!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  const checkedLineup = await lineup.findUnique({
    where: {
      id: lineupId,
    },
  });

  if (!checkedLineup)
    return res.send({ msg: `Lineup ${teamId} not found!` }).status(404);

  const foundTeamLineup = await team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      lineups: {
        where: {
          id: lineupId,
        },
        include: {
          athletes: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  res.send(foundTeamLineup).status(201);
};

const updateSingleLineup = async (req: Request, res: Response) => {
  const { teamId, lineupId, athletes, name } = req.body;

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  const checkedLineup = await lineup.findUnique({
    where: {
      id: lineupId,
    },
  });

  if (!checkedLineup)
    return res.send({ msg: `Lineup ${lineupId} not found!` }).status(404);

  //  Update lineup
  await lineup.update({
    where: {
      id: lineupId,
    },
    data: {
      name,
    },
  });

  await athletesInLineups.deleteMany({
    where: {
      lineupId,
    },
  });

  for (let athleteUnit of athletes) {
    await athletesInLineups.create({
      data: {
        position: athleteUnit.position,
        lineupId,
        athleteId: athleteUnit.id,
      },
    });
  }

  res.send({ msg: `New lineup ${lineupId} updated!` });
};

const deleteSingleLineup = async (req: Request, res: Response) => {
  const { teamId, lineupId } = req.body;
  if (!teamId || !lineupId) return res.send({ msg: `Please include teamid!` });

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!checkedTeam)
    return res.send({ msg: `Team ${teamId} not found!` }).status(404);

  const checkedLineup = await lineup.findUnique({
    where: {
      id: lineupId,
    },
  });

  if (!checkedLineup)
    return res.send({ msg: `Lineup ${lineupId} not found!` }).status(404);

  await athletesInLineups.deleteMany({
    where: {
      lineupId,
    },
  });

  await lineup.delete({
    where: {
      id: lineupId,
    },
  });

  res
    .send({
      msg: `Successfully deleted lineup ${lineupId} from team ${teamId}!`,
    })
    .status(204);
};

export {
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
  getAllTeamLineups,
  postNewTeamLineup,
  deleteAllTeamLineups,
  getSingleTeamLineup,
  updateSingleLineup,
  deleteSingleLineup,
};
