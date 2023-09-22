import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  checkForAthlete,
  checkForLineup,
  checkForRacePlan,
  checkForTeam,
} from "../middleware/checks";
const {
  team,
  athlete,
  lineup,
  athletesInTeams,
  athletesInLineups,
  racePlan,
  planSection,
  regattaPlanSection,
  eventPlanSection,
  lineupPlanSection,
  notesPlanSection,
} = new PrismaClient();
import { faker } from "@faker-js/faker";

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

const generateUserTeamAthletesLineups = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const capitalizeFirstLetter = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const teamCount = await team.count({
    where: {
      userId,
    },
  });
  if (teamCount)
    return res
      .status(404)
      .send({ msg: "Already have teams, abort auto-generate." });

  let teamName = "";
  while (true) {
    teamName = `The ${capitalizeFirstLetter(
      faker.word.adjective()
    )} ${capitalizeFirstLetter(faker.word.noun())}s`;

    const checkedTeam = await team.findFirst({
      where: {
        name: teamName,
      },
    });
    if (!checkedTeam) break;
  }

  await team.create({
    data: {
      name: teamName,
      division: faker.helpers.arrayElement([
        "u18",
        "u24",
        "premier",
        "seniora",
        "seniorb",
        "seniorc",
        "para",
      ]),
      level: faker.helpers.arrayElement(["sport", "community"]),
      eligibility: faker.helpers.arrayElement(["open", "women", "mixed"]),
      userId,
      lineups: {
        create: [
          {
            name: `${teamName} - Sample Lineup`,
          },
        ],
      },
    },
  });

  const foundTeam = await team.findFirst({
    where: {
      name: teamName,
    },
  });

  for (let i = 0; i < 30; i++) {
    let fakeEmail = "";
    while (true) {
      fakeEmail = `${faker.word.noun()}@${faker.company.name()}.com`;

      const checkedEmail = await athlete.findUnique({
        where: {
          email: fakeEmail,
        },
      });
      if (!checkedEmail) break;
    }

    await athlete.create({
      data: {
        email: fakeEmail,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        eligibility:
          foundTeam?.eligibility === "women"
            ? "W"
            : foundTeam?.eligibility === "open"
            ? "O"
            : faker.helpers.arrayElement(["O", "W"]),
        paddleSide: faker.helpers.arrayElement(["L", "R", "B", "N"]),
        weight: faker.number.int({ min: 90, max: 240 }),
        notes: faker.lorem.lines({ min: 1, max: 2 }),
        isAvailable: faker.datatype.boolean(),
        isManager: false,
        paddlerSkills: {
          create: {
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
          },
        },
      },
    });

    const foundAthlete = await athlete.findUnique({
      where: {
        email: fakeEmail,
      },
    });

    await athletesInTeams.create({
      data: {
        teamId: foundTeam!.id,
        athleteId: foundAthlete!.id,
      },
    });
  }

  const foundTeams = await team.findMany({
    where: {
      userId,
    },
  });

  //  get athletes by teamId

  const foundRoster = await athletesInTeams.findMany({
    where: {
      teamId: foundTeam!.id,
    },
  });

  const foundLineups = await lineup.findMany({
    where: {
      teamId: foundTeam!.id,
    },
  });

  const shuffleRoster = async (foundRoster: any, index: number) => {
    return foundRoster;
  };

  const populateRoster = async (shuffledRoster: any, foundLineup: any) => {
    for (let i = 0; i < 22; i++) {
      await athletesInLineups.create({
        data: {
          position: i,
          athleteId: shuffledRoster[i].athleteId,
          lineupId: foundLineup.id,
        },
      });
    }
  };

  foundLineups.forEach(async (foundLineup, index) => {
    const shuffledRoster = await shuffleRoster(foundRoster, index);
    await populateRoster(shuffledRoster, foundLineup);
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

  // const foundTeam = await team.findUnique({
  //   where: {
  //     id: teamId,
  //   },
  //   include: {
  //     lineups: true,
  //     athletes: true,
  //   },
  // });

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

//  No Race Day Plan ID
const getRacePlans = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  const foundRacePlans = await racePlan.findMany({
    where: {
      teamId,
    },
  });

  return res.status(200).send(foundRacePlans);
};

//  Create race plan
const createRacePlan = async (req: Request, res: Response) => {
  const { teamId } = req.params;
  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });
  console.log(`Creating new race plan for ${teamId}`);
  const { name, planOrder, regattaArr, eventArr, lineupArr, notesArr } =
    req.body;
  // console.log(planOrder);

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

  const newRacePlan = await racePlan.create({
    data: {
      name,
      teamId,
    },
  });

  await planOrder.forEach(async (section: any, index: number) => {
    await planSection.create({
      data: {
        id: section.id,
        section: section.section,
        sectionId: section.sectionId,
        order: index,
        racePlanId: newRacePlan.id,
      },
    });
  });

  //  Populate regatta sections
  if (regattaArr.length !== 0) {
    await regattaArr.forEach(async (regattaPlan: any) => {
      const {
        id,
        regattaName,
        regattaStartDate,
        regattaEndDate,
        regattaAddress,
        regattaContact,
        regattaEmail,
        regattaPhone,
      } = regattaPlan;

      await regattaPlanSection.create({
        data: {
          id,
          regattaName,
          regattaStartDate,
          regattaEndDate,
          regattaAddress,
          regattaContact,
          regattaEmail,
          regattaPhone,
          racePlanId: newRacePlan.id,
        },
      });
    });
  }

  //  Populate event sections
  if (eventArr.length !== 0) {
    await eventArr.forEach(async (eventPlan: any) => {
      const { id, eventName, eventTime, eventDistance, eventLane } = eventPlan;

      await eventPlanSection.create({
        data: {
          id,
          eventName,
          eventTime,
          eventDistance,
          eventLane,
          racePlanId: newRacePlan.id,
        },
      });
    });
  }

  //  Populate lineup sections
  if (lineupArr.length !== 0) {
    await lineupArr.forEach(async (lineupPlan: any) => {
      const { id, lineupName, lineupId } = lineupPlan;

      await lineupPlanSection.create({
        data: {
          id,
          lineupName,
          lineupId,
          racePlanId: newRacePlan.id,
        },
      });
    });
  }

  //  Populate notes sections
  if (notesArr.length !== 0) {
    await notesArr.forEach(async (notesPlan: any) => {
      const { id, notesName, notesBody } = notesPlan;

      await notesPlanSection.create({
        data: {
          id,
          notesName,
          notesBody,
          racePlanId: newRacePlan.id,
        },
      });
    });
  }

  const newFullRacePlan = await racePlan.findUnique({
    where: {
      id: newRacePlan.id,
    },
    include: {
      regattaSection: true,
      eventSection: true,
      lineupSection: true,
      notesSection: true,
      planSections: true,
    },
  });

  return res.status(200).send(newFullRacePlan);
};

//  Race Day Plan ID

//  Get single race plan
const getSingleRacePlan = async (req: Request, res: Response) => {
  const { teamId, racePlanId } = req.params;
  if (!teamId || !racePlanId)
    return res
      .status(404)
      .send({ msg: `Please include teamId and racePlanId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const checkedRacePlan = await checkForRacePlan(racePlanId);
  if (!checkedRacePlan)
    return res.status(404).send({ msg: `Race plan ${racePlanId} not found!` });

  const foundRacePlan = await racePlan.findUnique({
    where: {
      id: racePlanId,
    },
    include: {
      planSections: true,
      regattaSection: true,
      eventSection: true,
      lineupSection: true,
      notesSection: true,
    },
  });

  return res.status(200).send(foundRacePlan);
};

//  Currently in progress
const updateRacePlan = async (req: Request, res: Response) => {
  const { teamId, racePlanId } = req.params;
  let { name, planOrder, regattaArr, eventArr, lineupArr, notesArr } = req.body; //  get incoming passed data from front-end
  console.log(`updating race plan ${racePlanId}`);
  console.log(planOrder);

  if (!teamId || !racePlanId)
    return res
      .status(404)
      .send({ msg: `Please include teamId and racePlanId!` });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam)
    return res.status(404).send({ msg: `Team ${teamId} not found!` });

  const checkedRacePlan = await checkForRacePlan(racePlanId);
  if (!checkedRacePlan)
    return res.status(404).send({ msg: `Race Plan ${racePlanId} not found!` });

  //  Update raceplan name
  await racePlan.update({
    where: {
      id: racePlanId,
    },
    data: {
      name,
    },
  });

  //  delete current note plan section
  await planSection.deleteMany({
    where: { racePlanId },
  });

  // re-create note plan section
  await planOrder.forEach(async (section: any, index: number) => {
    await planSection.create({
      data: {
        id: section.id,
        section: section.section,
        sectionId: section.sectionId,
        order: index,
        racePlanId,
      },
    });
  });

  //  New Iteration - Regatta
  let existingRegattaSectionArr = await regattaPlanSection.findMany({
    where: {
      racePlanId,
    },
  });
  const updateRegattaArr: any[] = [];
  regattaArr.forEach(async (regatta: any) => {
    const foundRegatta = existingRegattaSectionArr.find(
      (existingRegatta) => existingRegatta.id === regatta.id
    );

    if (foundRegatta) {
      updateRegattaArr.push(regatta);
      regattaArr = regattaArr.filter(
        (regattaSection: any) => regattaSection.id !== regatta.id
      );
      existingRegattaSectionArr = existingRegattaSectionArr.filter(
        (existingRegatta) => {
          return existingRegatta.id !== regatta.id;
        }
      );
    }
  });

  existingRegattaSectionArr.forEach(async (existingRegatta) => {
    const { id } = existingRegatta;
    await regattaPlanSection.delete({
      where: {
        id,
      },
    });
  });
  regattaArr.forEach(async (incomingRegatta: any) => {
    const {
      id,
      regattaName,
      regattaStartDate,
      regattaEndDate,
      regattaAddress,
      regattaContact,
      regattaEmail,
      regattaPhone,
    } = incomingRegatta;
    await regattaPlanSection.create({
      data: {
        id,
        regattaName,
        regattaStartDate,
        regattaEndDate,
        regattaAddress,
        regattaContact,
        regattaEmail,
        regattaPhone,
        racePlanId,
      },
    });
  });
  updateRegattaArr.forEach(async (updateRegatta) => {
    const {
      id,
      regattaName,
      regattaStartDate,
      regattaEndDate,
      regattaAddress,
      regattaContact,
      regattaEmail,
      regattaPhone,
    } = updateRegatta;
    await regattaPlanSection.update({
      where: {
        id,
      },
      data: {
        regattaName,
        regattaStartDate,
        regattaEndDate,
        regattaAddress,
        regattaContact,
        regattaEmail,
        regattaPhone,
      },
    });
  });

  //  New Iteration - Event
  let existingEventSectionArr = await eventPlanSection.findMany({
    where: {
      racePlanId,
    },
  });
  const updateEventArr: any[] = [];
  eventArr.forEach(async (event: any) => {
    const foundEvent = existingEventSectionArr.find(
      (existingEvent) => existingEvent.id === event.id
    );

    if (foundEvent) {
      updateEventArr.push(event);
      eventArr = eventArr.filter(
        (eventSection: any) => eventSection.id !== event.id
      );
      existingEventSectionArr = existingEventSectionArr.filter(
        (existingEvent) => {
          return existingEvent.id !== event.id;
        }
      );
    }
  });

  existingEventSectionArr.forEach(async (existingEvent) => {
    const { id } = existingEvent;
    await eventPlanSection.delete({
      where: {
        id,
      },
    });
  });
  eventArr.forEach(async (incomingEvent: any) => {
    const { id, eventName, eventTime, eventDistance, eventLane } =
      incomingEvent;
    await eventPlanSection.create({
      data: {
        id,
        eventName,
        eventTime,
        eventDistance,
        eventLane,
        racePlanId,
      },
    });
  });
  updateEventArr.forEach(async (updateEvent) => {
    const { id, eventName, eventTime, eventDistance, eventLane } = updateEvent;
    await eventPlanSection.update({
      where: {
        id,
      },
      data: {
        eventName,
        eventTime,
        eventDistance,
        eventLane,
      },
    });
  });

  //  New Iteration - Lineup
  let existingLineupSectionArr = await lineupPlanSection.findMany({
    where: {
      racePlanId,
    },
  });
  const updateLineupArr: any[] = [];
  lineupArr.forEach(async (lineup: any) => {
    const foundLineup = existingLineupSectionArr.find(
      (existingLineup) => existingLineup.id === lineup.id
    );

    if (foundLineup) {
      updateLineupArr.push(lineup);
      lineupArr = lineupArr.filter(
        (lineupSection: any) => lineupSection.id !== lineup.id
      );
      existingLineupSectionArr = existingLineupSectionArr.filter(
        (existingLineup) => {
          return existingLineup.id !== lineup.id;
        }
      );
    }
  });

  console.log("delete", existingLineupSectionArr);
  existingLineupSectionArr.forEach(async (existingLineup) => {
    await lineupPlanSection.delete({
      where: {
        id: existingLineup.id,
      },
    });
  });
  console.log("create", lineupArr);
  lineupArr.forEach(async (incomingLineup: any) => {
    const { id, lineupName, lineupId } = incomingLineup;
    await lineupPlanSection.create({
      data: {
        id,
        lineupName,
        lineupId,
        racePlanId,
      },
    });
  });
  console.log("update", updateLineupArr);
  updateLineupArr.forEach(async (updateLineup) => {
    const { id, lineupName, lineupId } = updateLineup;
    await lineupPlanSection.update({
      where: {
        id,
      },
      data: {
        lineupName,
        lineupId,
      },
    });
  });

  //  New Iteration - Notes
  let existingNotesSectionArr = await notesPlanSection.findMany({
    where: {
      racePlanId,
    },
  });
  const updateNotesArr: any[] = [];
  notesArr.forEach(async (note: any) => {
    const foundNote = existingNotesSectionArr.find(
      (existingNote) => existingNote.id === note.id
    );

    if (foundNote) {
      updateNotesArr.push(note);
      notesArr = notesArr.filter(
        (noteSection: any) => noteSection.id !== note.id
      );
      existingNotesSectionArr = existingNotesSectionArr.filter(
        (existingNote) => {
          return existingNote.id !== note.id;
        }
      );
    }
  });

  existingNotesSectionArr.forEach(async (existingNote) => {
    await notesPlanSection.delete({
      where: {
        id: existingNote.id,
      },
    });
  });
  notesArr.forEach(async (incomingNote: any) => {
    const { id, notesName, notesBody } = incomingNote;
    await notesPlanSection.create({
      data: {
        id,
        notesName,
        notesBody,
        racePlanId,
      },
    });
  });
  updateNotesArr.forEach(async (updateNote) => {
    const { id, notesName, notesBody } = updateNote;
    await notesPlanSection.update({
      where: {
        id,
      },
      data: {
        notesName,
        notesBody,
      },
    });
  });

  return res.status(200).send({ name, racePlanId });
};

const deleteRacePlan = async (req: Request, res: Response) => {
  const { teamId, racePlanId } = req.params;

  if (!teamId) return res.status(404).send({ msg: `Please include teamId!` });
  if (!teamId || !racePlanId)
    return res
      .status(404)
      .send({ msg: `Please include teamId and racePlanId!` });

  await racePlan.deleteMany({
    where: {
      id: racePlanId,
    },
  });

  return res.status(204).send({ msg: "Successfully deleted!" });
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
  getRacePlans,
  createRacePlan,
  getSingleRacePlan,
  updateRacePlan,
  deleteRacePlan,
};
