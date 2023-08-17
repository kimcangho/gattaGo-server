import { PrismaClient } from "@prisma/client";
const { team, athlete, lineup } = new PrismaClient();

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

export { checkForTeam, checkForAthlete, checkForLineup };
