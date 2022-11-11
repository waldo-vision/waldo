import { Request, Response } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import ytdl from 'ytdl-core';
import * as fs from 'fs';
import {
  Footage,
  FootageInput,
  FootageUpdateInput,
} from '../models/footage.interface';
import { Clip } from '../models/clip.interface';

const createFootage = async (
  /**
   * POST /footage
   * @summary Endpoint to create new Footage document based on submission from web form.
   * @param {string} id.form.required - The User's Discord ID - application/x-www-form-urlencoded
   * @param {string} username.form.required - The User's Discord name - application/x-www-form-urlencoded
   * @param {string} url.form.required - The YouTube URL with capture footage - application/x-www-form-urlencoded
   * @return {FootageDocument} 200 - Success response returns created Footage document.
   * @return 428 - TYPE ERROR: The username field must be a string or the id field must be numbers, or the url field must be a string.
   * @return 422 - A required form item is missing (i.e.: id, username, url).
   * @return 406 - The YouTube URL is not to an acceptable.
   * @return 400 - The YouTube URL has already been submitted.
   */
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { id, username, url } = req.body;

  // eventually convert to a util file ex errorhandling.ts in a helpers folder.
  if (!id || !username || !url) {
    return res
      .status(422)
      .json({ message: 'The fields id, username, and URL are required' });
  }

  if (typeof username !== 'string') {
    return res
      .status(428)
      .json({ message: `TYPE ERROR: username ${username} is not a string` });
  }
  if (typeof id !== 'number') {
    return res.status(428).json({
      message: `TYPE ERROR: id ${id} is not a number or multiple numbers.`,
    });
  }
  if (typeof url !== 'string') {
    return res
      .status(428)
      .json({ message: `TYPE ERROR: url ${url} is not a string` });
  }

  const existingFootage = await Footage.findOne({ youtubeUrl: url });

  if (existingFootage) {
    return res.status(400).send(`URL ${url} has already been submitted.`);
  }

  try {
    const footageId = uuidv4();

    // Validate that the URL contains a video that can be downloaded.
    await ytdl.getInfo(url);
    // Download video and save as a local MP4 to be used for processing.
    await ytdl(url).pipe(fs.createWriteStream(`${footageId}.mp4`));

    // TODO: Implement functionality to trigger python kill shot parsing script.
    // https://www.tutorialspoint.com/run-python-script-from-node-js-using-child-process-spawn-method
    // https://github.com/waldo-vision/aimbot-detection-prototype/blob/main/auto_clip.py
    // If we get resulting clips, then isCsgoFootage should be true.

    // TODO: Implement functionality to trigger logic to shrink video capture width & height.
    // It would be best to do this logic directly within Python script when saving the clip files.
    // Otherwise cropping could be achieved by using FFMPEG or something along those lines.

    // TODO: Submit clips with unique IDs and association to footage ID (API to set DB & FS to create clip file).
    // Each clip should be submitted to the database as a ClipInput.
    // Each clip should be stored to a location on the local server where it can be obtained by the Analysis team.

    const footageInput: FootageInput = {
      uuid: footageId,
      discordId: id,
      username,
      youtubeUrl: url,
      isCsgoFootage: false,
      isAnalyzed: false,
    };

    await Footage.create(footageInput);

    return res.status(201).json({ data: footageInput });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(406).json({ message: error.message });
    }

    return res
      .status(404)
      .json({ message: 'Something went wrong parsing video from URL' });
  }
};

/**
 * GET /footage
 * @summary Endpoint to get all available Footage documents.
 * @return {array<FootageDocument>} 200 - Success response returns an array of Footage documents.
 */
const getAllFootage = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const footage = await Footage.find().sort('-createdAt').exec();

  return res.status(200).json({ data: footage });
};

/**
 * GET /footage/:uuid
 * @summary Endpoint to get a specific Footage document.
 * @return {FootageDocument} 200 - Success response returns the Footage document.
 * @return 404 - Footage with UUID could not be found.
 */
const getFootage = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { uuid } = req.params;
  const footage = await Footage.findOne({ uuid: uuid });

  if (!validate(uuid)) {
    return res
      .status(404)
      .json({ message: `UUID Param: ${uuid} is not a valid UUID` });
  }

  if (!footage) {
    return res
      .status(404)
      .json({ message: `Footage with uuid "${uuid}" not found.` });
  }

  return res.status(200).json({ data: footage });
};

/**
 * GET /footage/user/:id
 * @summary Endpoint to get all Footage documents associated to a user.
 * @return {array<FootageDocument>} 200 - Success response returns the Footage document.
 * @return 404 - No Footage found with the provided User ID.
 */
const getUserFootage = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { id } = req.params;
  const userFootage = await Footage.find({ discordId: id });

  if (userFootage.length === 0) {
    return res.status(404).json({
      message: 'No footage found with the provided User ID.',
      data: userFootage,
    });
  }

  return res.status(200).json({ data: userFootage });
};

/**
 * GET /footage/clips/:uuid
 * @summary Endpoint to get all Clip documents associated to a specific Footage UUID.
 * @return {array<ClipDocument>} 200 - Success response returns the Footage document.
 * @return 404 - No Clips found for the provided Footage UUID.
 */
const getFootageClips = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { uuid } = req.params;
  const footageClips = await Clip.find({ footage: uuid });

  if (footageClips.length === 0) {
    return res.status(404).json({
      message: `No clips found for footage with uuid "${uuid}"`,
      data: footageClips,
    });
  }

  return res.status(200).json({ data: footageClips });
};

/**
 * PATCH /footage/:uuid
 * @summary Endpoint to update a specific Footage document.
 * @return {FootageDocument} 200 - Success response returns the Footage document updated and a message.
 * @return {string} 200 - Success response returns the Footage document updated and a message.
 * @return 400 - Fields isCsgoFootage & isAnalyzed were not provided.
 * @return 406 - One of the params (UUID, isCsgoFootage or isAnalyzed) was not provided.
 * @return 412 - No document with the provided UUID was found.
 * @return 418 - An error occured while attempting to update the FootageDocument.
 */
const updateFootage = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { uuid } = req.params;
  const { isCsgoFootage, isAnalyzed } = req.body;
  // check if all fields were supplied
  if (
    uuid === undefined ||
    isCsgoFootage === undefined ||
    isAnalyzed === undefined
  ) {
    return res.status(400).json({
      message:
        'The fields uuid, isCsgoFootage, and isAnalyed must be supplied.',
    });
  }

  // check if id provided is a UUIDv4.
  if (!validate(uuid)) {
    return res
      .status(406)
      .json({ message: `UUID Param: ${uuid} is not a valid UUID.` });
  }
  // username is type of string?
  // isCsgoFootage is type of boolean?
  if (typeof isCsgoFootage !== 'boolean') {
    return res
      .status(406)
      .json({ message: 'The isCsgoFootage field must be a boolean.' });
  }
  // isAnalyzed is type of boolean?
  if (typeof isAnalyzed !== 'boolean') {
    return res
      .status(406)
      .json({ message: 'The isAnalyzed field must be a boolean.' });
  }

  const updatedFootage: FootageUpdateInput = {
    isAnalyzed: isAnalyzed,
    isCsgoFootage: isCsgoFootage,
  };

  const filter = { uuid: uuid };
  try {
    const result = await Footage.findOneAndUpdate(filter, updatedFootage);
    if (!result) {
      return res
        .status(412)
        .json({ message: 'No document with that UUID was found.' });
    }
  } catch (err) {
    return res.status(418).json({ message: err });
  }

  return res.status(200).json({
    message: 'Updated the footage document successfully!',
    updatedFootage: updateFootage,
  });
};

/**
 * DELETE /footage/:uuid
 * @summary Endpoint to delete a specific Footage document.
 * @return 200 - Successfully deleted Footage document based on UUID.
 * @return 404 - Footage UUID not found.
 */
const deleteFootage = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { uuid } = req.params;

  if (!uuid) {
    res.status(422).send('Parameter "uuid" is required.');
  }

  const deleteResult = await Footage.deleteOne({ uuid: uuid });

  if (deleteResult.deletedCount === 0) {
    return res.status(404).send(`Footage with uuid "${uuid}" not found.`);
  }

  return res.status(200).json({ message: 'Footage deleted successfully.' });
};

export {
  createFootage,
  deleteFootage,
  getAllFootage,
  getUserFootage,
  getFootage,
  getFootageClips,
  updateFootage,
};
