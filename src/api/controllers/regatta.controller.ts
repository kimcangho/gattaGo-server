import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  checkForEvent,
  checkForEvents,
  checkForRegatta,
  checkForTeam,
} from "../utility/checks";
const { regatta, teamsInRegattas, teamsInEvents, event } = new PrismaClient();

//  *** Regatta Requests ***

const getRegattas = async (_req: Request, res: Response) => {
  const regattas = await regatta.findMany();
  if (regattas) return res.json(regattas).status(200);
  res.send({ msg: "No regattas found!" }).status(404);
};

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
  res.json({ msg: "Regatta added!" }).status(201);
};

const getRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(404);
  res.json(foundRegatta).status(200);
};

const updateRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  const { name, address, phone, email, startDate, endDate } = req.body;
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(404);

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

  return res.send({ msg: "Successfully updated" }).status(200);
};

const deleteRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(404);

  const foundEvents = await checkForEvents(regattaId);

  for (let eventUnit of foundEvents) {
    await teamsInEvents.deleteMany({
      where: {
        eventId: eventUnit.id,
      },
    });
  }

  await teamsInRegattas.deleteMany({
    where: {
      regattaId,
    },
  });

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

  return res
    .send({ msg: `Regatta ${regattaId} successfully deleted!` })
    .status(204);
};

//  *** Regatta Event Requests ***

const getEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvents = await checkForEvents(regattaId);
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

  res.json(foundRegattaEvents).status(200);
};

const postEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  const {
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
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.send({ msg: "Regatta not found" }).status(404);

  const postedEvent = await event.create({
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
      msg: `Created new event ${postedEvent.id} for regatta ${regattaId}`,
    })
    .status(201);
};

const deleteEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "Regatta not found" }).status(404);

  const foundEvents = await checkForEvents(regattaId);

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

const getSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId, eventId } = req.params;
  if (!regattaId || !eventId)
    return res
      .send({ msg: `Please include regattaId and eventId!` })
      .status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvent = await checkForEvents(eventId);
  if (!checkedEvent) return res.send({ msg: "No event found!" }).status(404);

  const foundEvent = await event.findUnique({
    where: {
      id: eventId,
    },
    include: { teams: {} },
  });

  res.json(foundEvent).status(200);
};

const updateSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  const {
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
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvent = await checkForEvent(eventId);
  if (!checkedEvent) return res.send({ msg: "No event found!" }).status(404);

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

  res.send({ msg: `Event ${eventId} successfully updated!` }).status(200);
};

const deleteSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId, eventId } = req.params;
  if (!regattaId || !eventId)
    return res
      .send({ msg: `Please include regattaId and eventId!` })
      .status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedEvent = checkForEvent(eventId);
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

  res.send({ msg: `Event ${eventId} successfully deleted` }).status(204);
};

//  *** Regatta Team Requests ***

const getAllTeamsByRegattaID = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
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

const postTeamtoRegatta = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.params;
  if (!regattaId || !teamId)
    return res
      .send({ msg: `Please include regattaId and teamId!` })
      .status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedTeam = await checkForTeam(teamId);
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

  res
    .send({
      msg: `Team ${teamId} successfully registered to regatta ${regattaId}!`,
    })
    .status(201);
};

const deleteTeamFromRegatta = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.params;
  if (!regattaId || !teamId)
    return res.send({ msg: `Please include regattaId!` }).status(404);

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.send({ msg: "No regatta found!" }).status(404);

  const checkedTeam = await checkForTeam(teamId);
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
