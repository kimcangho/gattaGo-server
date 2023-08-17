import { PrismaClient } from "@prisma/client";
const { team, athletesInTeams } = new PrismaClient();

const checkForTeam = async (id: string) => {
  const foundTeam = team.findUnique({
    where: {
      id,
    },
  });
  return foundTeam;
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
  team.create({
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

export {
  checkForTeam,
  checkForTeamName,
  findTeams,
  createTeam,
  createTeamWithLineup,
  countTeams,
  findTeamAthletes,
  findTeamAthletesWithAthletes,
  updateTeam,
  deleteTeam,
  findTeamLineups,
  findTeamLineup,
};
