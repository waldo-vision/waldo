import { Request, Response } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import {
  Clip,
  ClipInput,
  ClipDocument,
  ClipZod,
  ClipZodSchema,
  ClipRetrieveZod,
  ClipRetrieveSchema,
} from '../models/clip.interface';
import { defaultEndpointsFactory, z, createHttpError } from 'express-zod-api';
import { fileStreamingEndpointsFactory } from '../factories/fileStreamingEndpointsFactory';
/**
 * POST /clip/:footage
 * @summary Endpoint to create new clip based on provided Footage UUID.
 * @return {ClipDocument} 200 - Success response returns created Clip document.
 * @return 422 - Couldnt create the clip document.
 */
export const createClip = defaultEndpointsFactory.build({
  method: 'post',
  input: z.object({
    uuid: z.string().uuid(),
  }),
  output: ClipZodSchema,
  handler: async ({ input: { uuid }, options, logger }) => {
    const uniqueId = uuidv4();

    // TODO: Implement logic to store clips to storage directory named after the Footage ID.
    const clipCreated = await Clip.create({
      uuid: uniqueId,
      footage: uuid,
    });

    if (!clipCreated) {
      throw createHttpError(422, `Unable to create a clip document.`);
    }

    return clipCreated;
  },
});

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
export const downloadClipById = fileStreamingEndpointsFactory.build({
  method: 'get',
  input: z.object({
    uuid: z.string().uuid(),
  }),
  output: z.object({
    uuid: z.string(),
  }),
  handler: async ({ input: { uuid }, options, logger }) => ({
    // most functionality is in the streamingEndPointFactory file.. see ../factories/fileStreamingEndpointsFactory.
    uuid: uuid,
  }),
});

/**
 * GET /clip
 * @summary Endpoint to get all available Clip documents.
 * @return {array<ClipDocument>} 200 - Success response returns an array of Clip documents.
 * @return 404 - No clip document with the UUID provided could be found or the database is empty.
 */
export const getClip = defaultEndpointsFactory.build({
  method: 'get',
  input: z.object({
    uuid: z.string().uuid().optional(),
    // ignores the output error below uncomment if you want to try and fix it
    // the error doesn't cause any problems with operations.
  }),
  output: ClipRetrieveSchema,
  handler: async ({ input: { uuid }, options, logger }) => {
    const clipResult: any[] = [];
    if (uuid) {
      const clip = await Clip.findOne({ uuid });
      if (clip === null) {
        console.log('error');
        throw createHttpError(
          404,
          'No clip document with the UUID provided could be found.',
        );
      }
      clipResult.push(clip);
    } else {
      const allClips = await Clip.find().sort('-createdAt').exec();
      if (allClips == null) {
        throw createHttpError(404, 'No clip documents could be found.');
      }
      allClips.forEach((doc, index) => {
        clipResult.push(doc);
      });
    }
    return { clips: clipResult };
  },
});

/**
 * DELETE /clip/:uuid
 * @summary Endpoint to delete a specific Clip document.
 * @return 200 - Successfully deleted Clip document based on UUID.
 * @return 404 - Clip with UUID not found.
 */
export const deleteClip = defaultEndpointsFactory.build({
  method: 'delete',
  input: z.object({
    uuid: z.string().uuid().optional(),
  }),
  output: z.object({ message: z.string() }),
  handler: async ({ input: { uuid }, options, logger }) => {
    const deleteResult = await Clip.deleteOne({ uuid });

    if (deleteResult.deletedCount === 0) {
      throw createHttpError(
        404,
        `Couldn't find the clip associated with uuid ${uuid}.`,
      );
    }
    return { message: `Clip with uuid: ${uuid} was deleted successfully.` };
  },
});
