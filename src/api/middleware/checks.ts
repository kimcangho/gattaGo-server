import { PrismaClient } from "@prisma/client";
const { regatta, team, event, athlete, lineup } = new PrismaClient();

//  Check for regatta
const checkForRegatta = async (id: string) => {
  const foundRegatta = await regatta.findUnique({
    where: {
      id,
    },
  });

  return foundRegatta;
};

//  Check for single event
const checkForEvent = async (id: string) => {
  const foundEvent = await event.findUnique({
    where: {
      id,
    },
  });
  return foundEvent;
};

//  Check for many events
const checkForEvents = async (id: string) => {
  const foundEvents = await event.findMany({
    where: {
      id,
    },
  });
  return foundEvents;
};

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

export {
  checkForRegatta,
  checkForEvent,
  checkForEvents,
  checkForTeam,
  checkForAthlete,
  checkForLineup,
};
