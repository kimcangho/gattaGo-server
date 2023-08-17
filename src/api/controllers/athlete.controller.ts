import { Request, Response } from "express";
import {
  checkForAthlete,
  checkForEmail,
  createAthleteInTeam,
  createAthlete,
  checkDuplicateEmail,
  updateAthlete,
  deleteAthlete,
} from "../services/athlete.services";

//  *** Athlete Requests ***

//  No Athlete ID
const postNewAthlete = async (req: Request, res: Response) => {
  const {
    teamId,
    email,
    firstName,
    lastName,
    eligibility,
    isAvailable,
    paddleSide,
    weight,
    notes,
    paddlerSkillsObj,
  } = req.body;

  const checkedEmail = await checkForEmail(email);
  if (checkedEmail) {
    return res.status(400).send({ duplicateEmail: checkedEmail.email });
  }

  const { id } = await createAthlete(
    email,
    firstName,
    lastName,
    eligibility,
    paddleSide,
    weight,
    notes,
    isAvailable,
    paddlerSkillsObj
  );

  await createAthleteInTeam(teamId, id);

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

  const reformattedAthlete = {
    ...checkedAthlete,
    paddlerSkills: checkedAthlete.paddlerSkills[0],
  };

  res.status(200).send(reformattedAthlete);
};

const updateAthleteByID = async (req: Request, res: Response) => {
  const { athleteId } = req.params;
  const {
    email,
    firstName,
    lastName,
    eligibility,
    isAvailable,
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

  const checkedDuplicateEmail = await checkDuplicateEmail(email, athleteId);
  if (checkedDuplicateEmail) {
    return res
      .status(400)
      .send({ duplicateEmail: checkedDuplicateEmail.email });
  }

  try {
    await updateAthlete(
      athleteId,
      email,
      firstName,
      lastName,
      eligibility,
      paddleSide,
      weight,
      notes,
      isAvailable,
      paddlerSkillsObj
    );
  } catch (err) {
    console.log(err);
  }

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

  await deleteAthlete(athleteId);

  res.status(204).send({ msg: `Athlete ${athleteId} successfully deleted!` });
};

export { postNewAthlete, getAthleteByID, updateAthleteByID, deleteAthleteByID };
