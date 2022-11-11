import { Model, Document } from 'mongoose';
/**
 * A Clip Document
 * @typedef {object} ClipDocument
 * @property {string} id.required - The new unique ID for clip creation
 * @property {string} footage.required - The associated Footage ID
 */
declare type ClipDocument = Document & {
  uuid: string;
  footage: string;
};
declare type ClipInput = {
  uuid: ClipDocument['uuid'];
  footage: ClipDocument['footage'];
};
declare const Clip: Model<ClipDocument>;
export { Clip };
export type { ClipInput, ClipDocument };
//# sourceMappingURL=clip.interface.d.ts.map
