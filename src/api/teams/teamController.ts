import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const {
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

  res.send(checkedTeam).status(200)
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
      rosterId: teamId,
    },
  });

  await team.delete({
    where: {
      id: teamId,
    },
  });

  res.send({ msg: `Successfully deleted team ${teamId}!` }).status(204);
};

export {
  getAllTeams,
  createTeam,
  getSingleTeamByID,
  updateSingleTeamByID,
  deleteSingleTeamByID,
};
