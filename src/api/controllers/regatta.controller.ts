import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  checkForEvent,
  checkForEvents,
  checkForRegatta,
  checkForTeam,
} from "../middleware/checks";
const { regatta, teamsInRegattas, teamsInEvents, event } = new PrismaClient();

//  *** Regatta Requests ***

const getRegattas = async (_req: Request, res: Response) => {
  const regattas = await regatta.findMany();
  return res.status(200).send(regattas);
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
  res.status(201).send({ msg: "Regatta added!" });
};

const getRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.status(404).send({ msg: "Regatta not found" });
  res.status(200).send(foundRegatta);
};

const updateRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  const { name, address, phone, email, startDate, endDate } = req.body;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.status(404).send({ msg: "Regatta not found" });

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

  return res.status(200).send({ msg: "Successfully updated" });
};

const deleteRegattaById = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.status(404).send({ msg: "Regatta not found" });

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
    .status(204)
    .send({ msg: `Regatta ${regattaId} successfully deleted!` });
};

//  *** Regatta Event Requests ***

const getEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedEvents = await checkForEvents(regattaId);
  if (checkedEvents.length === 0)
    return res.status(404).send({ msg: "No events in regatta!" });

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

  res.status(200).send(foundRegattaEvents);
};

const postEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  const {
    distance,
    division,
    level,
    eligibility,
    boatSize,
    progressionType,
    startTime,
    lanes,
    entries,
  } = req.body;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const foundRegatta = await checkForRegatta(regattaId);
  if (!foundRegatta) return res.status(404).send({ msg: "Regatta not found" });

  const postedEvent = await event.create({
    data: {
      distance,
      division,
      level,
      eligibility,
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

  res.status(201).send({
    msg: `Created new event ${postedEvent.id} for regatta ${regattaId}`,
  });
};

const deleteEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "Regatta not found" });

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

  res.status(204).send({
    msg: `At end of deleteEventsByRegattaId for regatta: ${regattaId}`,
  });
};

const getSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId, eventId } = req.params;
  if (!regattaId || !eventId)
    return res
      .status(404)
      .send({ msg: `Please include regattaId and eventId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedEvent = await checkForEvents(eventId);
  if (!checkedEvent) return res.status(404).send({ msg: "No event found!" });

  const foundEvent = await event.findUnique({
    where: {
      id: eventId,
    },
    include: { teams: {} },
  });

  res.status(200).send(foundEvent);
};

const updateSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  const {
    eventId,
    distance,
    division,
    level,
    eligibility,
    boatSize,
    progressionType,
    startTime,
    lanes,
    entries,
  } = req.body;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedEvent = await checkForEvent(eventId);
  if (!checkedEvent) return res.status(404).send({ msg: "No event found!" });

  await event.update({
    where: {
      id: eventId,
    },
    data: {
      distance,
      division,
      level,
      eligibility,
      boatSize,
      progressionType,
      startTime: new Date(startTime),
      lanes,
      entries,
    },
  });

  res.status(200).send({ msg: `Event ${eventId} successfully updated!` });
};

const deleteSingleEventByRegattaId = async (req: Request, res: Response) => {
  const { regattaId, eventId } = req.params;
  if (!regattaId || !eventId)
    return res
      .status(404)
      .send({ msg: `Please include regattaId and eventId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedEvent = checkForEvent(eventId);
  if (!checkedEvent) return res.status(404).send({ msg: "No event found!" });

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

  res.status(204).send({ msg: `Event ${eventId} successfully deleted` });
};

//  *** Regatta Team Requests ***

const getAllTeamsByRegattaID = async (req: Request, res: Response) => {
  const { regattaId } = req.params;
  if (!regattaId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const foundTeams = await teamsInRegattas.findMany({
    where: {
      regattaId,
    },
  });
  if (foundTeams.length === 0) return res.send({ msg: "No teams in regatta!" });

  res.status(200).send(foundTeams);
};

const postTeamtoRegatta = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.params;
  if (!regattaId || !teamId)
    return res
      .status(404)
      .send({ msg: `Please include regattaId and teamId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

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

  res.status(201).send({
    msg: `Team ${teamId} successfully registered to regatta ${regattaId}!`,
  });
};

const deleteTeamFromRegatta = async (req: Request, res: Response) => {
  const { regattaId, teamId } = req.params;
  if (!regattaId || !teamId)
    return res.status(404).send({ msg: `Please include regattaId!` });

  const checkedRegatta = await checkForRegatta(regattaId);
  if (!checkedRegatta)
    return res.status(404).send({ msg: "No regatta found!" });

  const checkedTeam = await checkForTeam(teamId);
  if (!checkedTeam) return res.status(404).send({ msg: "Team not found!" });

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

  res.status(204).send({
    msg: `Team ${teamId} successfully de-listed from regatta ${regattaId}!`,
  });
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
