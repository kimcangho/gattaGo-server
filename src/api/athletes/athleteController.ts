import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { checkForAthlete } from "../utility/checks";
const { athlete, athletesInLineups, athletesInTeams } = new PrismaClient();

//  *** Athlete Requests ***

//  No Athlete ID

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
    return res
      .send({ msg: `Athlete with email ${email} already exists!` })
      .status(404);

  const postedAthlete = await athlete.create({
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

  res.send(`New athlete ${postedAthlete.id} created!`).status(201);
};

//  Athlete ID

const getAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId)
    return res.send({ msg: `Please include athleteId!` }).status(404);

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .send({ msg: `Unable to find athlete ${athleteId}!` })
      .status(404);

  res.send(checkedAthlete).status(200);
};

const updateAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
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
  if (!athleteId)
    return res.send({ msg: `Please include athleteId!` }).status(404);

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .send({ msg: `Athlete with email ${athleteId} not found!` })
      .status(404);

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

  res.send({ msg: `Athlete ${athleteId} successfully updated!` }).status(200);
};

const deleteAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId)
    return res.send({ msg: `Please include athleteId!` }).status(404);

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .send({ msg: `Unable to find athlete ${athleteId}!` })
      .status(404);

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

  res.send({ msg: `Athlete ${athleteId} successfully deleted!` }).status(204);
};

export { postNewAthlete, getAthleteByID, updateAthleteByID, deleteAthleteByID };
