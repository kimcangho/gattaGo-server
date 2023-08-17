import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; //  to remove
import {
  checkForTeam,
  checkForTeamName,
  countTeams,
  createTeam,
  createTeamWithLineup,
  deleteTeam,
  findTeamAthletes,
  findTeamAthletesWithAthletes,
  findTeamLineup,
  findTeamLineups,
  findTeams,
  updateTeam,
} from "../services/team.services";
import {
  checkForAthlete,
  checkForEmail,
  createAthlete,
} from "../services/athlete.services";
import {
  checkForLineup,
  createAthleteInLineup,
  createLineup,
  deleteAthletesInLineups,
  deleteLineup,
  deleteLineups,
  deleteTeamLineups,
  findLineupIDs,
  findLineups,
  populateLineup,
  updateLineup,
} from "../services/lineup.services";
const { athletesInTeams } = new PrismaClient(); //  to remove
import { faker } from "@faker-js/faker";

//  *** Team Requests ***

//  User ID

const getAllUserTeams = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const foundTeams = await findTeams(userId);
  if (foundTeams) return res.status(200).send(foundTeams);
  res.status(404).send({ msg: "No teams found" });
};

const createUserTeam = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, division, level, eligibility } = req.body;

  await createTeam(name, division, level, eligibility, userId);
  res.status(201).send({ msg: "Successfully created new team!" });
};

const generateUserTeamAthletesLineups = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const teamCount = await countTeams(userId);
  if (teamCount)
    return res
      .status(404)
      .send({ msg: "Already have teams, abort auto-generate." });

  let teamName = "";
  while (true) {
    teamName = `The ${capitalizeFirstLetter(
      faker.word.adjective()
    )} ${capitalizeFirstLetter(faker.word.noun())}s`;

    const checkedDuplicateTeamName = await checkForTeamName(teamName);
    if (!checkedDuplicateTeamName) break;
  }

  await createTeamWithLineup(
    teamName,
    faker.helpers.arrayElement([
      "u18",
      "u24",
      "premier",
      "seniora",
      "seniorb",
      "seniorc",
      "para",
    ]),
    faker.helpers.arrayElement(["sport", "community"]),
    faker.helpers.arrayElement(["O", "W", "M"]),
    userId
  );

  const foundDuplicateTeam = await checkForTeamName(teamName);

  for (let i = 0; i < 30; i++) {
    let fakeEmail = "";
    while (true) {
      fakeEmail = `${faker.word.noun()}@${faker.company.name()}.com`;
      const checkedEmail = await checkForEmail(fakeEmail);
      if (!checkedEmail) break;
    }

    await createAthlete(
      fakeEmail,
      faker.person.firstName(),
      faker.person.lastName(),
      faker.helpers.arrayElement(["O", "W"]),
      faker.helpers.arrayElement(["L", "R", "B", "N"]),
      faker.number.int({ min: 90, max: 240 }),
      faker.lorem.lines({ min: 1, max: 2 }),
      faker.datatype.boolean(),
      {
        isSteers: false,
        isDrummer: false,
        isStroker: false,
        isCaller: false,
        isBailer: false,
        //  Section
        isPacer: false,
        isEngine: false,
        isRocket: false,
        //  Race Distances
        is200m: false,
        is500m: false,
        is1000m: false,
        is2000m: false,
        //  Strengths
        isVeteran: false,
        isSteadyTempo: false,
        isVocal: false,
        isTechnicallyProficient: false,
        isLeader: false,
        //  Weaknesses
        isNewbie: false,
        isRushing: false,
        isLagging: false,
        isTechnicallyPoor: false,
        isInjuryProne: false,
        isLoadManaged: false,
      }
    );

    const foundAthlete = await checkForEmail(fakeEmail);

    await athletesInTeams.create({
      data: {
        teamId: foundDuplicateTeam!.id,
        athleteId: foundAthlete!.id,
      },
    });
  }

  const foundTeams = await findTeams(userId);

  //  get athletes by teamId

  const foundRoster = await findTeamAthletes(foundDuplicateTeam!.id);
  const foundLineups = await findLineups(foundDuplicateTeam!.id);

  const populateRoster = async (shuffledRoster: any, foundLineup: any) => {
    for (let i = 0; i < 22; i++) {
      await populateLineup(i, shuffledRoster[i].athleteId, foundLineup.id);
    }
  };

  foundLineups.forEach(async (foundLineup) => {
    await populateRoster(foundRoster, foundLineup);
  });

  if (foundTeams) return res.status(200).send(foundTeams);
  res.status(404).send({ msg: "No teams found" });
};

//  Team ID

const getSingleTeamByID = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  const foundLineups = await findLineups(teamId);
  const foundAthletes = await findTeamAthletesWithAthletes(teamId);

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

  await updateTeam(teamId, name, division, level, eligibility);
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
    await deleteAthletesInLineups(athleteUnit.athleteId);
  }

  await athletesInTeams.deleteMany({
    where: {
      teamId,
    },
  });

  await deleteLineups(teamId);
  await deleteTeam(teamId);

  res.status(204).send({ msg: `Successfully deleted team ${teamId}!` });
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

  await deleteAthletesInLineups(athleteId);

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

  const foundTeamLineups = await findTeamLineups(teamId);
  res.status(200).send(foundTeamLineups);
};

const postNewTeamLineup = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  const { athletes, name } = req.body;
  if (!teamId) return res.status(404).send(`Please include teamId!`);

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const newLineup = await createLineup(name, teamId);

  for (let athleteUnit of athletes) {
    if (!athleteUnit.athlete.isEmpty) {
      await createAthleteInLineup(
        newLineup.id,
        athleteUnit?.athleteId,
        athleteUnit?.position
      );
    }
  }

  res.status(201).send(newLineup);
};

const deleteAllTeamLineups = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamid!` });

  const foundLineupIDs = await findLineupIDs(teamId);

  for (let lineupUnit of foundLineupIDs) {
    await deleteTeamLineups(lineupUnit.id);
  }

  await deleteLineups(teamId);

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

  const foundTeamLineup = findTeamLineup(teamId, lineupId);
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

  await updateLineup(lineupId, name);
  await deleteLineups(lineupId);

  for (let athleteUnit of athletes) {
    await createAthleteInLineup(
      lineupId,
      athleteUnit.athleteId,
      athleteUnit.position
    );
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

  await deleteTeamLineups(lineupId);
  await deleteLineup(lineupId);

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
  generateUserTeamAthletesLineups,
  getSingleTeamByID,
  updateSingleTeamByID,
  deleteSingleTeamByID,
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
