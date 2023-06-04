import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { checkForAthlete } from "../middleware/checks";
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
      .status(404)
      .send({ msg: `Athlete with email ${email} already exists!` });

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

  res.status(201).send(`New athlete ${postedAthlete.id} created!`);
};

//  Athlete ID

const getAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId)
    return res.status(404).send({ msg: `Please include athleteId!` });

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .status(404)
      .send({ msg: `Unable to find athlete ${athleteId}!` });

  res.status(200).send(checkedAthlete);
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
    return res.status(404).send({ msg: `Please include athleteId!` });

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .status(404)
      .send({ msg: `Athlete with email ${athleteId} not found!` });

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

  res.status(200).send({ msg: `Athlete ${athleteId} successfully updated!` });
};

const deleteAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  if (!athleteId)
    return res.status(404).send({ msg: `Please include athleteId!` });

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .status(404)
      .send({ msg: `Unable to find athlete ${athleteId}!` });

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

  res.status(204).send({ msg: `Athlete ${athleteId} successfully deleted!` });
};

export { postNewAthlete, getAthleteByID, updateAthleteByID, deleteAthleteByID };
