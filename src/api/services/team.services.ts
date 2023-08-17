import { PrismaClient } from "@prisma/client";
const { team, athletesInTeams } = new PrismaClient();

const checkForTeam = async (id: string) => {
  return await team.findUnique({
    where: {
      id,
    },
  });
};

const checkForTeamName = async (name: string) => {
  return await team.findFirst({
    where: {
      name,
    },
  });
};

const findTeams = async (userId: string) => {
  return await team.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

const findTeamAthletes = async (teamId: string) => {
  return await athletesInTeams.findMany({
    where: {
      teamId,
    },
  });
};

const findTeamAthletesWithAthletes = async (teamId: string) => {
  return await athletesInTeams.findMany({
    where: { teamId },
    include: { athlete: true },
  });
};

const findTeamAthletesWithPaddlerSkills = async (teamId: string) => {
  return await athletesInTeams.findMany({
    where: {
      teamId,
    },
    include: { athlete: { include: { paddlerSkills: true } } },
    orderBy: {
      updatedAt: "asc",
    },
  });
};

const createTeam = async (
  name: string,
  division: string,
  level: string,
  eligibility: string,
  userId: string
) => {
  return await team.create({
    data: {
      name,
      division,
      level,
      eligibility,
      userId,
    },
  });
};

const createTeamWithLineup = async (
  name: string,
  division: string,
  level: string,
  eligibility: string,
  userId: string
) => {
  await team.create({
    data: {
      name,
      division,
      level,
      eligibility,
      userId,
      lineups: {
        create: [
          {
            name: `${name} - Sample Lineup`,
          },
        ],
      },
    },
  });
};

const countTeams = async (userId: string) => {
  return await team.count({
    where: {
      userId,
    },
  });
};

const updateTeam = async (
  teamId: string,
  name: string,
  division: string,
  level: string,
  eligibility: string
) => {
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
};

const deleteTeam = async (id: string) => {
  await team.delete({
    where: { id },
  });
};

const findTeamLineups = async (id: string) => {
  return await team.findUnique({
    where: { id },
    include: {
      lineups: true,
    },
  });
};

const findTeamLineup = async (teamId: string, lineupId: string) => {
  return await team.findUnique({
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
};

const deleteTeamAthletes = async (teamId: string) => {
  await athletesInTeams.deleteMany({
    where: {
      teamId,
    },
  });
};

const deleteTeamAthlete = async (teamId: string, athleteId: string) => {
  await athletesInTeams.deleteMany({
    where: {
      athleteId,
      teamId,
    },
  });
};

const findExistingTeamAthlete = async (teamId: string, athleteId: string) => {
  return await athletesInTeams.findFirst({
    where: {
      teamId,
      athleteId,
    },
  });
};

const countTeamAthletes = async (teamId: string) => {
  return await athletesInTeams.count({
    where: {
      teamId,
    },
  });
};

const countPaddleSides = async (teamId: string, paddleSide: string) => {
  return await athletesInTeams.count({
    where: {
      teamId,
      athlete: {
        paddleSide,
      },
    },
  });
};

const countAvailabilities = async (teamId: string, flag: boolean) => {
  return await athletesInTeams.count({
    where: {
      teamId,
      athlete: {
        isAvailable: flag,
      },
    },
  });
};

const countEligibilities = async (teamId: string, flag: string) => {
  return await athletesInTeams.count({
    where: {
      teamId,
      athlete: {
        eligibility: flag,
      },
    },
  });
};

const countAthleteWeights = async (
  teamId: string,
  eligibility: string,
  weightFloor: number,
  weightCeiling: number
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

const getAthleteWeights = async (teamId: string) => {
  return await athletesInTeams.findMany({
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
};

export {
  checkForTeam,
  checkForTeamName,
  findTeams,
  createTeam,
  createTeamWithLineup,
  countTeams,
  findTeamAthletes,
  findTeamAthletesWithAthletes,
  findTeamAthletesWithPaddlerSkills,
  updateTeam,
  deleteTeam,
  deleteTeamAthlete,
  deleteTeamAthletes,
  findTeamLineups,
  findTeamLineup,
  findExistingTeamAthlete,
  countTeamAthletes,
  countPaddleSides,
  countAvailabilities,
  countEligibilities,
  countAthleteWeights,
  getAthleteWeights,
};
