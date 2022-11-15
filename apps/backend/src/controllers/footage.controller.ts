import { v4 as uuidv4 } from 'uuid';
import ytdl from 'ytdl-core';
import * as fs from 'fs';

import {
  Footage,
  FootageZod,
  FootageZodSchema,
  FootageUpdateInputSchema,
  FootageCreateInputSchema,
  FootageRetrieveSchema,
} from '../models/footage.interface';
import { Clip, ClipZodSchema } from '../models/clip.interface';
import { createHttpError, defaultEndpointsFactory, z } from 'express-zod-api';
import { parseClips } from '../services/clips';

/**
 * POST /footage
 * @summary Endpoint to create new Footage document based on submission from web form.
 * @param {string} id.form.required - The User's Discord ID - application/x-www-form-urlencoded
 * @param {string} url.form.required - The YouTube URL with capture footage - application/x-www-form-urlencoded
 * @return {FootageDocument} 200 - Success response returns created Footage document.
 * @return 422 - A required form item is missing (i.e.: id, url).
 * @return 406 - The YouTube URL is not to an acceptable.
 * @return 400 - The YouTube URL has already been submitted.
 * @return 500 - Some internal error
 */
export const createFootage = defaultEndpointsFactory.build({
  method: 'post',
  input: FootageCreateInputSchema,
  output: FootageZodSchema,
  handler: async ({ input: { id, url } }) => {
    const existingFootage = await Footage.findOne({ youtubeUrl: url });
    const footageId = uuidv4();

    if (existingFootage) {
      throw createHttpError(400, `URL ${url} has already been submitted.`);
    }

    try {
      // Validate that the URL contains a video that can be downloaded.
      await ytdl.getInfo(url);

      // TODO: Get formats from getInfo and download acceptable format from yt.
      await ytdl(url).pipe(fs.createWriteStream(`${footageId}.mp4`));

      const footageInput: FootageZod = {
        uuid: footageId,
        discordId: id,
        youtubeUrl: url,
      };

      Footage.create(footageInput);

      parseClips(footageId, `${footageId}.mp4`);

      return footageInput;
    } catch (error) {
      throw createHttpError(500, 'Something went wrong processing the video.');
    }
  },
});

/**
 * GET /footage/:uuid
 * @summary Endpoint to get a specific Footage document.
 * @return {FootageDocument} 200 - Success response returns the Footage document.
 * @return 404 - Footage with UUID could not be found.
 */
export const getFootage = defaultEndpointsFactory.build({
  method: 'get',
  input: z.object({
    uuid: z.string().uuid().optional(),
  }),
  // ignores the output error below uncomment if you want to try and fix it
  // the error doesn't cause any problems with operations.
  output: FootageRetrieveSchema,
  handler: async ({ input: { uuid } }) => {
    // all footage returns
    const footageResult = [];
    if (uuid) {
      const footage = await Footage.findOne({ uuid });

      if (footage === null) {
        throw createHttpError(
          404,
          'No footage document with the UUID provided could be found.',
        );
      }

      footageResult.push(footage);
    } else {
      const allFootage = await Footage.find().sort('-createdAt').exec();

      if (allFootage == null) {
        throw createHttpError(404, 'No footage documents could be found.');
      }

      allFootage.forEach(doc => {
        footageResult.push(doc);
      });
    }
    return { footage: footageResult };
  },
});

/**
 * GET /footage/user/:id
 * @summary Endpoint to get all Footage documents associated to a user.
 * @return {array<FootageDocument>} 200 - Success response returns the Footage document.
 * @return 404 - No Footage found with the provided User ID.
 */
export const getUserFootage = defaultEndpointsFactory.build({
  method: 'get',
  input: z.object({
    // had to change to string because the param is sent as a string not as a number for some reason.
    discordId: z.number(),
  }),
  output: z.object({
    footage: z.array(FootageZodSchema),
  }),
  handler: async ({ input: { discordId } }) => {
    const footage = await Footage.find({ discordId });

    if (footage.length === 0)
      throw createHttpError(404, 'No footage found with the provided User ID.');

    return { footage };
  },
});

/**
 * GET /footage/clips/:uuid
 * @summary Endpoint to get all Clip documents associated to a specific Footage UUID.
 * @return {array<ClipDocument>} 200 - Success response returns the Footage document.
 * @return 404 - No Clips found for the provided Footage UUID.
 */
export const getFootageClips = defaultEndpointsFactory.build({
  method: 'get',
  input: z.object({
    uuid: z.string().uuid(),
  }),
  output: z.object({
    clips: z.array(ClipZodSchema),
  }),
  handler: async ({ input: { uuid } }) => {
    const clips = await Clip.find({ footage: uuid });

    if (clips.length === 0)
      throw createHttpError(
        404,
        `No clips found for footage with uuid "${uuid}"`,
      );

    return { clips };
  },
});

/**
 * PATCH /footage/:uuid
 * @summary Endpoint to update a specific Footage document.
 * @return {FootageDocument} 200 - Success response returns the Footage document updated and a message.
 * @return {string} 200 - Success response returns the Footage document updated and a message.
 * @return 400 - Fields isCsgoFootage & isAnalyzed were not provided.
 * @return 406 - One of the params (UUID, isCsgoFootage or isAnalyzed) was not provided.
 * @return 412 - No document with the provided UUID was found.
 * @return 418 - An error occured while attempting to update the FootageDocument.
 * @return 500 - Some internal error
 */
export const updateFootage = defaultEndpointsFactory.build({
  method: 'patch',
  input: FootageUpdateInputSchema,
  output: FootageZodSchema,
  handler: async ({ input: { uuid, analyzed, csgoFootage, parsed } }) => {
    const updatedFootage = {
      analyzed,
      csgoFootage,
      parsed,
    };

    const filter = { uuid: uuid };
    try {
      const result = await Footage.findOneAndUpdate(filter, updatedFootage);
      if (!result)
        throw createHttpError(412, 'No document with that UUID was found.');

      return result;
    } catch (error) {
      if (error instanceof Error) {
        // probably don't want to do this in prod
        throw createHttpError(418, error.message);
      }

      throw createHttpError(500, 'Something went wrong processing the video.');
    }
  },
});

/**
 * DELETE /footage/:uuid
 * @summary Endpoint to delete a specific Footage document.
 * @return 200 - Successfully deleted Footage document based on UUID.
 * @return 404 - Footage UUID not found.
 */
export const deleteFootage = defaultEndpointsFactory.build({
  method: 'delete',
  input: z.object({
    uuid: z.string(),
  }),
  output: z.object({
    message: z.string(),
  }),
  handler: async ({ input: { uuid } }) => {
    const deleteResult = await Footage.deleteOne({ uuid: uuid });

    if (deleteResult.deletedCount === 0)
      throw createHttpError(404, `Footage with uuid "${uuid}" not found.`);

    return { message: 'Footage deleted successfully.' };
  },
});
