import { Request, Response } from 'express';
/**
 * POST /clip/:footage
 * @summary Endpoint to create new clip based on provided Footage UUID.
 * @param {string} footage.params.required - The associated Footage UUID.
 * @return {ClipDocument} 200 - Success response returns created Clip document.
 * @return 422 - The Footage UUID is missing from the request.
 */
declare const createClip: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
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
declare const downloadClipByID: (req: Request, res: Response) => Promise<any>;
/**
 * GET /clip
 * @summary Endpoint to get all available Clip documents.
 * @return {array<ClipDocument>} 200 - Success response returns an array of Clip documents.
 */
declare const getAllClips: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /clip/:uuid
 * @summary Endpoint to get a specific Clip document.
 * @return {ClipDocument} 200 - Success response returns Clip document.
 * @return 404 - Clip document with UUID not found.
 */
declare const getClip: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * DELETE /clip/:uuid
 * @summary Endpoint to delete a specific Clip document.
 * @return 200 - Successfully deleted Clip document based on UUID.
 * @return 404 - Clip UUID not found.
 */
declare const deleteClip: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
export { createClip, deleteClip, getAllClips, getClip, downloadClipByID };
//# sourceMappingURL=clip.controller.d.ts.map
