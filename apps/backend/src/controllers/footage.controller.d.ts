import { Request, Response } from 'express';
declare const createFootage: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /footage
 * @summary Endpoint to get all available Footage documents.
 * @return {array<FootageDocument>} 200 - Success response returns an array of Footage documents.
 */
declare const getAllFootage: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /footage/:uuid
 * @summary Endpoint to get a specific Footage document.
 * @return {FootageDocument} 200 - Success response returns the Footage document.
 * @return 404 - Footage with UUID could not be found.
 */
declare const getFootage: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /footage/user/:id
 * @summary Endpoint to get all Footage documents associated to a user.
 * @return {array<FootageDocument>} 200 - Success response returns the Footage document.
 * @return 404 - No Footage found with the provided User ID.
 */
declare const getUserFootage: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * GET /footage/clips/:uuid
 * @summary Endpoint to get all Clip documents associated to a specific Footage UUID.
 * @return {array<ClipDocument>} 200 - Success response returns the Footage document.
 * @return 404 - No Clips found for the provided Footage UUID.
 */
declare const getFootageClips: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
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
declare const updateFootage: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
/**
 * DELETE /footage/:uuid
 * @summary Endpoint to delete a specific Footage document.
 * @return 200 - Successfully deleted Footage document based on UUID.
 * @return 404 - Footage UUID not found.
 */
declare const deleteFootage: (
  req: Request,
  res: Response,
) => Promise<Response<any, Record<string, any>>>;
export {
  createFootage,
  deleteFootage,
  getAllFootage,
  getUserFootage,
  getFootage,
  getFootageClips,
  updateFootage,
};
//# sourceMappingURL=footage.controller.d.ts.map
