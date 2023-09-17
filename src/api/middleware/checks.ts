import { PrismaClient } from "@prisma/client";
const { team, athlete, lineup, racePlan } = new PrismaClient();

//  Check for team
const checkForTeam = async (id: string) => {
  const foundTeam = team.findUnique({
    where: {
      id,
    },
  });
  return foundTeam;
};

//  Check for athlete
const checkForAthlete = async (id: string) => {
  const foundAthlete = athlete.findUnique({
    where: {
      id,
    },
    include: {
      paddlerSkills: true,
    },
  });
  return foundAthlete;
};

//  Check for lineup
const checkForLineup = async (id: string) => {
  const foundLineup = lineup.findUnique({
    where: {
      id,
    },
  });
  return foundLineup;
};

//  Check for race plan
const checkForRacePlan = async (id: string) => {
  const foundRacePlan = racePlan.findUnique({
    where: {
      id,
    },
  });
  return foundRacePlan;
};

export { checkForTeam, checkForAthlete, checkForLineup, checkForRacePlan };
