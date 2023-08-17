import { PrismaClient } from "@prisma/client";
const { athlete, athletesInTeams, athletesInLineups, paddlerSkills } =
  new PrismaClient();

//  Check for athlete by ID
const checkForAthlete = async (id: string) => {
  return await athlete.findUnique({
    where: {
      id,
    },
    include: {
      paddlerSkills: true,
    },
  });
};

//  Check for athlete by email
const checkForEmail = async (email: string) => {
  return await athlete.findUnique({
    where: {
      email,
    },
  });
};

//  Create athlete in team
const createAthleteInTeam = async (teamId: string, athleteId: string) => {
  await athletesInTeams.create({
    data: {
      teamId,
      athleteId,
    },
  });
};

//  Create Athlete
const createAthlete = async (
  email: string,
  firstName: string,
  lastName: string,
  eligibility: string,
  paddleSide: string,
  weight: number,
  notes: string,
  isAvailable: boolean,
  paddlerSkillsObj: any
) => {
  return await athlete.create({
    data: {
      email,
      firstName,
      lastName,
      eligibility,
      paddleSide,
      weight,
      notes,
      isAvailable,
      isManager: false,
      paddlerSkills: {
        create: paddlerSkillsObj,
      },
    },
  });
};

const checkDuplicateEmail = async (email: string, athleteId: string) => {
  return await athlete.findUnique({
    where: {
      email,
      NOT: {
        id: athleteId,
      },
    },
  });
};

const updateAthlete = async (
  athleteId: string,
  email: string,
  firstName: string,
  lastName: string,
  eligibility: string,
  paddleSide: string,
  weight: number,
  notes: string,
  isAvailable: boolean,
  paddlerSkillsObj: any
) => {
  await athlete.update({
    where: {
      id: athleteId,
    },
    data: {
      email,
      firstName,
      lastName,
      eligibility,
      paddleSide,
      weight,
      notes,
      isAvailable,
      isManager: false,
      paddlerSkills: {
        update: {
          where: {
            athleteId,
          },
          data: paddlerSkillsObj,
        },
      },
    },
  });
};

const deleteAthlete = async (athleteId: string) => {
  await athletesInLineups.deleteMany({
    where: { athleteId },
  });

  await athletesInTeams.deleteMany({
    where: { athleteId },
  });

  await paddlerSkills.delete({
    where: { athleteId },
  });

  await athlete.delete({
    where: { id: athleteId },
  });
};

export {
  checkForAthlete,
  checkForEmail,
  createAthleteInTeam,
  createAthlete,
  checkDuplicateEmail,
  updateAthlete,
  deleteAthlete,
};
