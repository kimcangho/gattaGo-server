import { PrismaClient } from "@prisma/client";
const { lineup, athletesInLineups } = new PrismaClient();

const checkForLineup = async (id: string) => {
  return await lineup.findUnique({
    where: {
      id,
    },
  });
};

const findLineups = async (teamId: string) => {
  return await lineup.findMany({
    where: {
      teamId,
    },
  });
};

const deleteLineups = async (teamId: string) => {
  await lineup.deleteMany({
    where: {
      teamId,
    },
  });
};

const deleteLineup = async (id: string) => {
  await lineup.delete({
    where: {
      id,
    },
  });
};

const createLineup = async (name: string, teamId: string) => {
  return await lineup.create({
    data: {
      name,
      teamId,
    },
  });
};

const findLineupIDs = async (teamId: string) => {
  return await lineup.findMany({
    where: {
      teamId,
    },
    select: {
      id: true,
    },
  });
};

const updateLineup = async (id: string, name: string) => {
  await lineup.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });
};

const populateLineup = async (
  position: number,
  athleteId: string,
  lineupId: string
) => {
  await athletesInLineups.create({
    data: {
      position,
      athleteId,
      lineupId,
    },
  });
};

const deleteAthletesInLineups = async (athleteId: string) => {
  await athletesInLineups.deleteMany({
    where: {
      athleteId,
    },
  });
};

const deleteTeamLineups = async (lineupId: string) => {
  await athletesInLineups.deleteMany({
    where: {
      lineupId,
    },
  });
};

const createAthleteInLineup = async (
  lineupId: string,
  athleteId: string,
  position: number
) => {
  await athletesInLineups.create({
    data: {
      lineupId,
      athleteId,
      position,
    },
  });
};

export {
  checkForLineup,
  findLineups,
  deleteLineup,
  deleteLineups,
  createLineup,
  findLineupIDs,
  updateLineup,
  populateLineup,
  deleteAthletesInLineups,
  deleteTeamLineups,
  createAthleteInLineup,
};
