import { Request, Response } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import { Clip } from '../models/clip.interface';

/**
 * POST /clip/:footage
 * @summary Endpoint to create new clip based on provided Footage UUID.
 * @param {string} footage.params.required - The associated Footage UUID.
 * @return {ClipDocument} 200 - Success response returns created Clip document.
 * @return 422 - The Footage UUID is missing from the request.
 */
const createClip = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { footage } = req.params;
  const uniqueId = uuidv4();

  if (!footage) {
    return res.status(422).json({ message: 'The field footage is required' });
  }

  // TODO: Implement logic to store clips to storage directory named after the Footage ID.

  const clipCreated = await Clip.create({
    uuid: uniqueId,
    footage,
  });

  return res.status(201).json({ data: clipCreated });
};

/**
 * GET /download/:uuid
 * @summary endpoint to retrieve a clip document using the uuid.
 * @return {<ClipDocument>} 200- Successfully found and retrieved the clip document.
 * @return 424 - The uuid param wasn't provided for the request.
 * @return 418 - The uuid param was provided but the param wasn't in uuid form.
 * @return 412 - An error occured while attempting to retrieve the clip document.
 * @return 408 - A clip document with the related uuid could not be found.
 * @return 406 - An error occured while attempting to download the clip.
 */
const downloadClipByID = async (req: Request, res: Response): Promise<any> => {
  const { uuid } = req.params;

  if (uuid === undefined) {
    return res
      .status(424)
      .json({ message: 'The uuid param wasnt found to be provided.' });
  }

  if (!validate(uuid)) {
    return res
      .status(418)
      .json({ message: `The param: ${uuid} was found not to be a uuid type.` });
  }

  const filter = { uuid: uuid };
  const result = await Clip.findOne(filter);
  if (result !== null) {
    // should change result.footage to the clip file uuid later on but rn this is just for testing of the stream... rn reads from local dir.
    return res.download(`${result.footage}.mp4`, function (err) {
      if (err) {
        // thoughts on handling this as you cant return another result response after the headers have been sent....
        // not a big deal as there is a very low probable chance that an error downloading will occur as long as the frontend is built solid.
        console.log('An error occured');
      }
    });
  } else {
    return res.status(408).json({
      message: 'A clip document with the uuid provided could not be found.',
    });
  }
};

/**
 * GET /clip
 * @summary Endpoint to get all available Clip documents.
 * @return {array<ClipDocument>} 200 - Success response returns an array of Clip documents.
 */
const getAllClips = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const clips = await Clip.find().sort('-createdAt').exec();

  return res.status(200).json({ data: clips });
};

/**
 * GET /clip/:uuid
 * @summary Endpoint to get a specific Clip document.
 * @return {ClipDocument} 200 - Success response returns Clip document.
 * @return 404 - Clip document with UUID not found.
 */
const getClip = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { uuid } = req.params;
  const clipDocument = await Clip.findOne({ uuid: uuid });

  if (!clipDocument) {
    return res
      .status(404)
      .json({ message: `Clip with uuid "${uuid}" not found.` });
  }

  return res.status(200).json({ data: clipDocument });
};

/**
 * DELETE /clip/:uuid
 * @summary Endpoint to delete a specific Clip document.
 * @return 200 - Successfully deleted Clip document based on UUID.
 * @return 404 - Clip UUID not found.
 */
const deleteClip = async (
  req: Request,
  res: Response,
): Promise<Response<any, Record<string, any>>> => {
  const { uuid } = req.params;
  const deleteResult = await Clip.deleteOne({ uuid: uuid });

  if (deleteResult.deletedCount === 0) {
    return res.status(404).send(`Footage with id "${uuid}" not found.`);
  }

  return res.status(200).json({ message: 'Clip deleted successfully.' });
};

export { createClip, deleteClip, getAllClips, getClip, downloadClipByID };
