import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { regatta, teamsInRegattas, teamsInEvents, event } = new PrismaClient();

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

//  Get single regatta
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
      competitionId: regattaId,
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
      competitionId: regattaId,
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

//  Get single regatta events
const getEventsByRegattaId = async (req: Request, res: Response) => {
  const { regattaId } = req.body;

  const foundRegatta = await regatta.findUnique({
    where: {
      id: regattaId,
    },
  });

  if (!foundRegatta) return res.send({ msg: "No regatta found!" }).status(404);

  const foundEvents = await event.findMany({
    where: {
      competitionId: regattaId,
    },
  });

  if (foundEvents.length === 0)
    return res.send({ msg: "No events in regatta!" }).status(404);

  res.json(foundEvents);
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
      competitionId: regattaId,
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
      competitionId: regattaId,
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
      competitionId: regattaId,
    },
  });

  res
    .send({
      msg: `At end of deleteEventsByRegattaId for regatta: ${regattaId}`,
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
};
