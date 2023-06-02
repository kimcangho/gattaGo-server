import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const { athlete, athletesInLineups, athletesInTeams } = new PrismaClient();

//  *** Athlete Requests ***

//  No Athlete ID

//  create new athlete
const postNewAthlete = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    gender,
    paddleSide,
    weight,
    birthDate,
    phone,
    email,
    notes,
  } = req.body;
  const checkedEmail = await athlete.findUnique({
    where: {
      email,
    },
  });
  if (checkedEmail)
    return res.send({ msg: `Athlete with email ${email} already exists!` });

  await athlete.create({
    data: {
      firstName,
      lastName,
      gender,
      paddleSide,
      weight,
      birthDate: new Date(birthDate),
      phone,
      email,
      notes,
      isAvailable: false,
      isManager: false,
    },
  });

  res.send(`New athlete created!`);
};

//  Athlete ID

//  get individual athlete
const getAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.body;

  const checkedAthlete = await athlete.findUnique({
    where: {
      id: athleteId,
    },
  });

  if (!checkedAthlete)
    return res.send({ msg: `Unable to find athlete ${athleteId}!` });

  res.send(checkedAthlete);
};

//  update individual athlete
const updateAthleteByID = async (req: Request, res: Response) => {
  const {
    athleteId,
    firstName,
    lastName,
    gender,
    paddleSide,
    weight,
    birthDate,
    phone,
    email,
    notes,
  } = req.body;
  const checkedAthlete = await athlete.findUnique({
    where: {
      id: athleteId,
    },
  });
  if (!checkedAthlete)
    return res.send({ msg: `Athlete with email ${athleteId} not found!` });

  await athlete.update({
    where: {
      id: athleteId,
    },
    data: {
      firstName,
      lastName,
      gender,
      paddleSide,
      weight,
      birthDate: new Date(birthDate),
      phone,
      email,
      notes,
    },
  });

  res.send({ msg: `Athlete ${athleteId} successfully updated!` });
};

//  delete individual athlete
const deleteAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.body;

  const checkedAthlete = await athlete.findUnique({
    where: {
      id: athleteId,
    },
  });

  if (!checkedAthlete)
    return res.send({ msg: `Unable to find athlete ${athleteId}!` });

  await athletesInLineups.deleteMany({
    where: {
      athleteId,
    },
  });

  await athletesInTeams.deleteMany({
    where: {
      athleteId,
    },
  });

  await athlete.delete({
    where: {
      id: athleteId,
    },
  });

  res.send({ msg: `Athlete ${athleteId} successfully deleted!` });
};

export { postNewAthlete, getAthleteByID, updateAthleteByID, deleteAthleteByID };
