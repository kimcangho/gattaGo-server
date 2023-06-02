import { PrismaClient } from "@prisma/client";
const { regatta, team, teamsInRegattas, teamsInEvents, event } =
  new PrismaClient();

//  Check for regatta
const checkForRegatta = async (regattaId: string) => {
  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  return foundRegatta;
};

//  Check for single event
const checkForEvent = async (eventId: string) => {
  const foundEvent = await event.findUnique({
    where: {
      id: eventId,
    },
  });
  return foundEvent;
};

//  Check for many events
const checkForEvents = async (regattaId: string) => {
  const foundEvents = await event.findMany({
    where: {
      regattaId,
    },
  });
  return foundEvents;
};

//  Check for team
const checkForTeam = async (teamId: string) => {
  const foundTeam = team.findUnique({
    where: {
      id: teamId,
    },
  });
  return foundTeam;
};

//  Check for athlete
//  Check for lineup

export { checkForRegatta, checkForEvent, checkForEvents, checkForTeam };
