import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { regatta, team, teamsInRegattas, teamsInEvents, event } =
  new PrismaClient();

//  *** Regatta Requests ***

//  Get all regattas
const getRegattas = async (_req: Request, res: Response) => {
  const regattas = await regatta.findMany();
  if (regattas) return res.json(regattas);
  res.send({ msg: "No regattas found!" }).status(404);
};

//  Create new regatta
const postRegatta = async (req: Request, res: Response) => {
  const { name, address, phone, email, startDate, endDate } = req.body;
  await regatta.create({
    data: {
      name,
      address,
      phone,
      email,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });
  res.json({ msg: "Regatta added!" });
};

//  Get single regatta - coach
const getRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.body;
  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(204);
  res.json(foundRegatta);
};

//  Update single regatta
const updateRegattaById = async (req: Request, res: Response) => {
  const { regattaId, name, address, phone, email, startDate, endDate } =
    req.body;
  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(204);

  await regatta.update({
    where: {
      id: regattaId,
    },
    data: {
      name,
      address,
      phone,
      email,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return res.send({ msg: "Successfully updated" }).status(204);
};

//  Delete single regatta
const deleteRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.body;

  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(204);

  const foundEvents = await event.findMany({
    where: {
      regattaId,
    },
    select: {
      id: true,
    },
  });

  await teamsInRegattas.deleteMany({
    where: {
      regattaId,
    },
  });

  for (let eventUnit of foundEvents) {
    await teamsInEvents.deleteMany({
      where: {
        eventId: eventUnit.id,
      },
    });
  }

  await event.deleteMany({
    where: {
      regattaId,
    },
  });

  await regatta.delete({
    where: {
      id: regattaId,
    },
  });

  return res.send({ msg: "Successfully deleted" }).status(204);
};

//  *** Regatta Event Requests ***

//  Get single regatta events - coach
const getEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvents = await event.findMany({
    where: {
      regattaId,
    },
  });

  if (checkedEvents.length === 0)
    return res.send({ msg: "No events in regatta!" }).status(404);

  const foundRegattaEvents = await regatta.findUnique({
    where: {
      id: regattaId,
    },
    include: {
      events: {
        include: { teams: {} },
      },
    },
  });

  res.json(foundRegattaEvents);
};

//  Create new regatta event
const postEventByRegattaId = async (req: Request, res: Response) => {
  const {
    regattaId,
    distance,
    division,
    level,
    gender,
    boatSize,
    progressionType,
    startTime,
    lanes,
    entries,
  } = req.body;

  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(204);

  await event.create({
    data: {
      distance,
      division,
      level,
      gender,
      boatSize,
      progressionType,
      startTime: new Date(startTime),
      lanes,
      entries,
      isSeeded: false,
      isCompleted: false,
      regattaId,
    },
  });

  res
    .send({
      msg: `At end of deleteEventsByRegattaId for regatta: ${regattaId}`,
    })
    .status(201);
};

//  Delete all events from regatta
const deleteEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.body;

  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(204);

  const foundEvents = await event.findMany({
    where: {
      regattaId,
    },
    select: {
      id: true,
    },
  });

  //  Delete teams in events
  for (let eventUnit of foundEvents) {
    await teamsInEvents.deleteMany({
      where: {
        eventId: eventUnit.id,
      },
    });
  }

  //  Delete events by regattaID
  await event.deleteMany({
    where: {
      regattaId,
    },
  });

  res
    .send({
      msg: `At end of deleteEventsByRegattaId for regatta: ${regattaId}`,
    })
    .status(204);
};

//  Get single event from regatta - coach
const getSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId, eventId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvent = await event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!checkedEvent) return res.send({ msg: "No event found!" }).status(404);

  const foundEvent = await event.findUnique({
    where: {
      id: eventId,
    },
    include: { teams: {} },
  });

  res.json(foundEvent);
};

//  Update single event from regatta
const updateSingleEventByRegattaId = async (req: Request, res: Response) => {
  const {
    regattaId,
    eventId,
    distance,
    division,
    level,
    gender,
    boatSize,
    progressionType,
    startTime,
    lanes,
    entries,
  } = req.body;

  //  Check for regatta
  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  //  Check for event
  const checkedEvent = await event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!checkedEvent) return res.send({ msg: "No event found!" }).status(404);

  //  Update event
  await event.update({
    where: {
      id: eventId,
    },
    data: {
      distance,
      division,
      level,
      gender,
      boatSize,
      progressionType,
      startTime: new Date(startTime),
      lanes,
      entries,
    },
  });

  res.send({ msg: `Event ${eventId} successfully updated!` }).status(204);
};

//  Delete single event from regatta
const deleteSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId, eventId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvent = await event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!checkedEvent) return res.send({ msg: "No event found!" }).status(404);

  await teamsInEvents.deleteMany({
    where: {
      eventId,
    },
  });
  await event.delete({
    where: {
      id: eventId,
    },
  });

  res.send({ msg: `Event ${eventId} successfully deleted` });
};

//  *** Regatta Team Requests ***

//  No team ID requests - coach
const getAllTeamsByRegattaID = async (req: Request, res: Response) => {
  const { regattaId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const foundTeams = await teamsInRegattas.findMany({
    where: {
      regattaId,
    },
  });
  if (foundTeams.length === 0) return res.send({ msg: "No teams in regatta!" });

  res.send(foundTeams).status(200);
};

//  Team ID requests

//  Register team to regatta - coach
const postTeamtoRegatta = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(404);

  const existingTeam = await teamsInRegattas.findMany({
    where: {
      regattaId,
      teamId,
    },
  });

  if (existingTeam.length !== 0)
    return res.send({
      msg: `Team ${teamId} already registered to regatta ${regattaId}`,
    });

  await teamsInRegattas.create({
    data: {
      regattaId,
      teamId,
    },
  });

  res.send({
    msg: `Team ${teamId} successfully registered to regatta ${regattaId}!`,
  });
};

//  Withdraw team from regatta - coach
const deleteTeamFromRegatta = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.body;

  const checkedRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedTeam = await team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!checkedTeam) return res.send({ msg: "Team not found!" }).status(404);

  await teamsInRegattas.deleteMany({
    where: {
      teamId,
      regattaId,
    },
  });

  await teamsInEvents.deleteMany({
    where: {
      teamId,
    },
  });

  res
    .send({
      msg: `Team ${teamId} successfully de-listed from regatta ${regattaId}!`,
    })
    .status(204);
};

export {
  getRegattas,
  postRegatta,
  getRegattaById,
  getEventsByRegattaId,
  postEventByRegattaId,
  deleteEventsByRegattaId,
  deleteRegattaById,
  updateRegattaById,
  getSingleEventByRegattaId,
  updateSingleEventByRegattaId,
  deleteSingleEventByRegattaId,
  getAllTeamsByRegattaID,
  postTeamtoRegatta,
  deleteTeamFromRegatta,
};
