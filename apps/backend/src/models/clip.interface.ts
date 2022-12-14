import { z } from 'express-zod-api';
import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * A Clip Document
 * @typedef {object} ClipDocument
 * @property {string} id.required - The new unique ID for clip creation
 * @property {string} footage.required - The associated Footage ID
 */
type ClipDocument = Document & {
  uuid: string;
  footage: string;
};

const ClipZodSchema = z.object({
  uuid: z.string().uuid(),
  footage: z.string().uuid(),
});

const ClipRetrieveSchema = z.object({
  clips: z.array(ClipZodSchema),
});

type ClipZod = z.infer<typeof ClipZodSchema>;
type ClipRetrieveZod = z.infer<typeof ClipRetrieveSchema>;

type ClipInput = {
  uuid: ClipDocument['uuid'];
  footage: ClipDocument['footage'];
};

const clipSchema = new Schema(
  {
    uuid: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    footage: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: 'clips',
    timestamps: true,
  },
);

if (mongoose.models.Clip) {
  delete mongoose.models.Clip;
}

const Clip: Model<ClipDocument> = mongoose.model<ClipDocument>(
  'Clip',
  clipSchema,
);

export { Clip, ClipRetrieveSchema, ClipZodSchema };
export type { ClipInput, ClipDocument, ClipZod, ClipRetrieveZod };
