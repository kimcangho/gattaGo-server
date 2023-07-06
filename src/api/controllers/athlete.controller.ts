import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { checkForAthlete } from "../middleware/checks";
const { athlete, athletesInLineups, athletesInTeams, paddlerSkills } =
  new PrismaClient();

//  *** Athlete Requests ***

//  No Athlete ID

//  To-do: refactor posting New Athlete
const postNewAthlete = async (req: Request, res: Response) => {
  const {
    teamId,
    email,
    firstName,
    lastName,
    eligibility,
    paddleSide,
    weight,
    notes,
    paddlerSkillsObj,
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

  const { id } = await athlete.create({
    data: {
      email,
      firstName,
      lastName,
      eligibility,
      paddleSide,
      weight,
      notes,
      isAvailable: true,
      isManager: false,
      paddlerSkills: {
        create: paddlerSkillsObj,
      },
    },
  });

  await athletesInTeams.create({
    data: {
      teamId: teamId,
      athleteId: id,
    },
  });

  res.status(201).send(`New athlete ${id} created!`);
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
    email,
    firstName,
    lastName,
    eligibility,
    paddleSide,
    weight,
    notes,
    paddlerSkillsObj,
  } = req.body;
  if (!athleteId)
    return res.status(404).send({ msg: `Please include athleteId!` });

  const checkedAthlete = await checkForAthlete(athleteId);
  if (!checkedAthlete)
    return res
      .status(404)
      .send({ msg: `Athlete with email ${athleteId} not found!` });

  try {
    await athlete.update({
      where: {
        id: athleteId,
      },
      data: {
        email,
        firstName,
        lastName,
        eligibility,
        paddleSide,
        weight,
        notes,
        isAvailable: true,
        isManager: false,
        paddlerSkills: {
          update: {
            where: {
              athleteId,
            },
            data: paddlerSkillsObj,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
  }

  res.status(200).send({ msg: `Athlete ${athleteId} successfully updated!` });
};

const deleteAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  console.log(athleteId);
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

  // if (checkedAthlete.paddlerSkills) {
  await paddlerSkills.delete({
    where: {
      athleteId,
    },
  });
  // }

  await athlete.delete({
    where: {
      id: athleteId,
    },
    include: { paddlerSkills: true },
  });

  res.status(204).send({ msg: `Athlete ${athleteId} successfully deleted!` });
};

export { postNewAthlete, getAthleteByID, updateAthleteByID, deleteAthleteByID };
