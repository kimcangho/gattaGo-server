import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  checkForAthlete,
  checkForLineup,
  checkForRegatta,
  checkForTeam,
} from "../middleware/checks";
const {
  team,
  lineup,
  athletesInTeams,
  teamsInRegattas,
  teamsInEvents,
  athletesInLineups,
} = new PrismaClient();

//  *** Team Requests ***

//  User ID

const getAllUserTeams = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const foundTeams = await team.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (foundTeams) return res.status(200).send(foundTeams);

  res.status(404).send({ msg: "No teams found" });
};

const createUserTeam = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, division, level, eligibility } = req.body;

  await team.create({
    data: {
      name,
      division,
      level,
      eligibility,
      userId,
    },
  });

  res.status(201).send({ msg: "Successfully created new team!" });
};

//  Team ID

const getSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  const foundTeam = await team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      lineups: true,
      athletes: true,
    },
  });

  const foundLineups = await lineup.findMany({
    where: {
      teamId,
    },
  });

  const foundAthletes = await athletesInTeams.findMany({
    where: { teamId },
    include: { athlete: true },
  });

  res.status(200).send({
    team: checkedTeam,
    lineups: foundLineups,
    athletes: foundAthletes,
  });
};

const updateSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { name, division, level, eligibility } = req.body;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });
  if (!name || !division || !level || !eligibility)
    return res.status(404).send({
      msg: `Please include name, division, level and eligibility!`,
    });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  await team.update({
    where: {
      id: teamId,
    },
    data: {
      name,
      division,
      level,
      eligibility,
    },
  });

  res.status(200).send({ msg: `Successfully updated team ${teamId}` });
};

const deleteSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

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

  res.status(204).send({ msg: `Successfully deleted team ${teamId}!` });
};

//  No regatta ID

const getAllRegattasRegisteredTo = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  const registeredRegattas = await teamsInRegattas.findMany({
    where: {
      teamId,
    },
  });
  res.status(200).send(registeredRegattas);
};

const deleteTeamFromRegattas = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  await teamsInRegattas.deleteMany({
    where: {
      teamId,
    },
  });

  res.status(204).send({ msg: `Team ${teamId} deleted from all regattas!` });
};

//  Regatta ID

const getAllTeamEventsByRegattaID = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.params;
  if (!regattaId || !teamId)
    return res
      .status(404)
      .send({ msg: `Please include regattaId and teamId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

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

  res.status(200).send(foundTeamEvents);
};

//  No Athlete ID

const getAllAthletesByTeamID = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const foundTeamAthletes = await athletesInTeams.findMany({
    where: {
      teamId,
    },
    include: { athlete: { include: { paddlerSkills: true } } },
    orderBy: {
      updatedAt: "asc",
    },
  });

  res.status(200).send(foundTeamAthletes);
};

const deleteAllAthletesByTeamID = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  await athletesInTeams.deleteMany({
    where: {
      teamId,
    },
  });

  res.status(204).send({ msg: `Athletes removed from team ${teamId}!` });
};

//  Athlete ID

const addAthleteToTeamByID = async (req: Request, res: Response) => {
  const { teamId, athleteId } = req.params;
  if (!teamId || !athleteId)
    return res
      .status(404)
      .send({ msg: `Please include teamId and athleteId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res.send({ msg: `Athlete ${athleteId} does not exist!` });

  const checkExistingAthleteInTeam = await athletesInTeams.findFirst({
    where: {
      teamId,
      athleteId,
    },
  });
  if (checkExistingAthleteInTeam)
    return res
      .status(404)
      .send(`Athlete ${athleteId} already exists in team ${teamId}!`);

  await athletesInTeams.create({
    data: {
      athleteId,
      teamId,
    },
  });

  res.status(201).send({
    msg: `Athlete ${athleteId} successfully added to team ${teamId}!`,
  });
};

const deleteAthleteFromTeamByID = async (req: Request, res: Response) => {
  const { teamId, athleteId } = req.body;
  if (!teamId || !athleteId)
    return res
      .status(404)
      .send({ msg: `Please include teamId and athleteId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

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

  res
    .status(204)
    .send({ msg: `Successfully delete athlete ${athleteId} from ${teamId}!` });
};

//  No Lineup ID

const getAllTeamLineups = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamid!` });

  const foundTeamLineups = await team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      lineups: true,
    },
  });

  res.status(200).send(foundTeamLineups);
};

const postNewTeamLineup = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { athletes, name } = req.body;
  if (!teamId) return res.status(404).send(`Please include teamId!`);

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const newLineup = await lineup.create({
    data: {
      name,
      teamId,
    },
  });

  for (let athleteUnit of athletes) {
    if (!athleteUnit.athlete.isEmpty) {
      await athletesInLineups.create({
        data: {
          lineupId: newLineup.id,
          athleteId: athleteUnit?.athleteId,
          position: athleteUnit?.position,
        },
      });
    }
  }

  res.status(201).send(newLineup);
};

const deleteAllTeamLineups = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamid!` });

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
    .status(204)
    .send({ msg: `Successfully deleted lineups from team ${teamId}!` });
};

//  Lineup ID

const getSingleTeamLineup = async (req: Request, res: Response) => {
  const { teamId, lineupId } = req.params;
  if (!teamId || !lineupId)
    return res.status(404).send({ msg: `Please include teamId and lineupId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const checkedLineup = await checkForLineup(lineupId);
  if (!checkedLineup)
    return res.status(404).send({ msg: `Lineup ${teamId} not found!` });

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
            include: {
              athlete: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  res.status(200).send(foundTeamLineup);
};

const updateSingleLineup = async (req: Request, res: Response) => {
  const { teamId, lineupId } = req.params;
  const { athletes, name } = req.body;

  if (!teamId || !lineupId)
    return res.status(404).send({ msg: `Please include teamId and lineupId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const checkedLineup = await checkForLineup(lineupId);
  if (!checkedLineup)
    return res.status(404).send({ msg: `Lineup ${lineupId} not found!` });

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
        athleteId: athleteUnit.athleteId,
      },
    });
  }

  return res.status(200).send({ name, lineupId });
};

const deleteSingleLineup = async (req: Request, res: Response) => {
  const { teamId, lineupId } = req.params;

  if (!teamId || !lineupId)
    return res.status(404).send({ msg: `Please include teamid!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const checkedLineup = await checkForLineup(lineupId);
  if (!checkedLineup)
    return res.status(404).send({ msg: `Lineup ${lineupId} not found!` });

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

  res.status(204).send({
    msg: `Successfully deleted lineup ${lineupId} from team ${teamId}!`,
  });
};

const getTeamDashboardDetails = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamid!` });

  const athleteCount = await athletesInTeams.count({
    where: {
      teamId,
    },
  });
  if (!athleteCount)
    return res.status(200).send({
      athleteCount: false,
      paddleSideCountArr: null,
      availabilityCountArr: null,
      eligibilityCountArr: null,
      weightCountArrOpen: null,
      weightCountArrWomen: null,
      avgWeights: null,
    });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const paddleSideArr = ["L", "B", "R", "N"];
  const countPaddleSides = async (side: string) => {
    return await athletesInTeams.count({
      where: {
        teamId,
        athlete: {
          paddleSide: side,
        },
      },
    });
  };
  const countAllPaddleSides = async () => {
    return Promise.all(paddleSideArr.map((side) => countPaddleSides(side)));
  };
  const paddleSideCountArr = await countAllPaddleSides();

  const availabilityArr = [true, false];
  const countAvailabilities = async (flag: boolean) => {
    return await athletesInTeams.count({
      where: {
        teamId,
        athlete: {
          isAvailable: flag,
        },
      },
    });
  };
  const countAllAvailabilities = async () => {
    return Promise.all(
      availabilityArr.map((availabilityFlag) =>
        countAvailabilities(availabilityFlag)
      )
    );
  };
  const availabilityCountArr = await countAllAvailabilities();

  const eligibilityArr = ["O", "W"];
  const countEligibilities = async (flag: string) => {
    return await athletesInTeams.count({
      where: {
        teamId,
        athlete: {
          eligibility: flag,
        },
      },
    });
  };
  const countAllEligibilities = async () => {
    return Promise.all(
      eligibilityArr.map((eligibilityFlag) =>
        countEligibilities(eligibilityFlag)
      )
    );
  };
  const eligibilityCountArr = await countAllEligibilities();

  const weightArr: any = [
    { weightFloor: 0, weightCeiling: 100 },
    { weightFloor: 100, weightCeiling: 120 },
    { weightFloor: 120, weightCeiling: 140 },
    { weightFloor: 140, weightCeiling: 160 },
    { weightFloor: 160, weightCeiling: 180 },
    { weightFloor: 180, weightCeiling: 200 },
    { weightFloor: 200, weightCeiling: 220 },
    { weightFloor: 220, weightCeiling: 9999999999 },
  ];
  const countWeights = async (
    weightFloor: number,
    weightCeiling: number,
    eligibility: string
  ) => {
    return await athletesInTeams.count({
      where: {
        teamId,
        athlete: {
          eligibility,
          weight: {
            gte: weightFloor,
            lt: weightCeiling,
          },
        },
      },
    });
  };
  const countAllWeights = async (eligibility: string) => {
    return Promise.all(
      weightArr.map((weightFlag: any) =>
        countWeights(
          weightFlag.weightFloor,
          weightFlag.weightCeiling,
          eligibility
        )
      )
    );
  };
  const weightCountArrOpen = await countAllWeights("O");
  const weightCountArrWomen = await countAllWeights("W");

  const getWeights = await athletesInTeams.findMany({
    where: {
      teamId,
    },
    include: {
      athlete: {
        select: {
          weight: true,
          eligibility: true,
        },
      },
    },
  });

  const sumWeights: number = getWeights.reduce(
    (accumulator: number, currrentValue: any) => {
      return accumulator + currrentValue.athlete.weight;
    },
    0
  );

  const numOpenAthletes: any[] = getWeights.filter((athlete) => {
    if (athlete.athlete.eligibility === "O") return athlete;
  });
  const sumOpenWeights: number = numOpenAthletes.reduce((acc, currVal) => {
    return acc + currVal.athlete.weight!;
  }, 0);
  const numWomenAthletes: any[] = getWeights.filter((athlete) => {
    if (athlete.athlete.eligibility === "W") return athlete;
  });
  const sumWomenWeights: number = numWomenAthletes.reduce((acc, currVal) => {
    return acc + currVal.athlete.weight!;
  }, 0);

  const avgWeight: number = sumWeights / getWeights.length;
  const avgOpenWeight: number = sumOpenWeights / numOpenAthletes.length;
  const avgWomenWeight: number = sumWomenWeights / numWomenAthletes.length;

  const avgWeights = {
    avgWeight,
    avgOpenWeight,
    avgWomenWeight,
  };

  res.status(200).send({
    athleteCount: true,
    paddleSideCountArr,
    availabilityCountArr,
    eligibilityCountArr,
    weightCountArrOpen,
    weightCountArrWomen,
    avgWeights,
  });
};

export {
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
  postNewTeamLineup,
  deleteAllTeamLineups,
  getSingleTeamLineup,
  updateSingleLineup,
  deleteSingleLineup,
  getTeamDashboardDetails,
};
