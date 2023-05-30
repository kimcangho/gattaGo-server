import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { regatta, teamsInRegattas, teamsInEvents, event } = new PrismaClient();

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

export {
  getRegattas,
  postRegatta,
  getRegattaById,
  deleteRegattaById,
  updateRegattaById,
};
