import { z } from 'express-zod-api';
import mongoose, { Document, Model, Schema } from 'mongoose';

type FootageDocument = Document & {
  uuid: string;
  discordId: number;
  youtubeUrl: string;
  parsed?: boolean;
  csgoFootage?: boolean;
  analyzed?: boolean;
  clips?: Array<string>;
};

const FootageZodSchema = z.object({
  uuid: z.string().uuid(),
  discordId: z.number(),
  youtubeUrl: z.string().url(),
  parsed: z.boolean().optional(),
  csgoFootage: z.boolean().optional(),
  analyzed: z.boolean().optional(),
  clips: z.string().array().optional(),
});

const FootageRetrieveSchema = z.object({
  footage: z.array(FootageZodSchema),
});

type FootageZod = z.infer<typeof FootageZodSchema>;
type FootageRetrieveZod = z.infer<typeof FootageRetrieveSchema>;
const FootageUpdateInputSchema = z.object({
  uuid: z.string().uuid(),
  parsed: z.boolean(),
  csgoFootage: z.boolean(),
  analyzed: z.boolean(),
  clips: z.string().array().optional(),
});

type FootageUpdateInput = z.infer<typeof FootageUpdateInputSchema>;

const FootageCreateInputSchema = z.object({
  id: z.number(),
  url: z.string().url(),
});

type FootageCreateInput = z.infer<typeof FootageCreateInputSchema>;

const footageSchema = new Schema(
  {
    uuid: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    discordId: {
      type: Schema.Types.Number,
      required: true,
    },
    youtubeUrl: {
      type: Schema.Types.String,
      required: true,
    },
    parsed: {
      type: Schema.Types.Boolean,
      required: false,
      default: undefined,
    },
    csgoFootage: {
      type: Schema.Types.Boolean,
      required: false,
      default: undefined,
    },
    analyzed: {
      type: Schema.Types.Boolean,
      required: false,
      default: undefined,
    },
    clips: {
      type: Array<string>(),
      required: false,
      default: undefined,
    },
  },
  {
    collection: 'footage',
    timestamps: true,
  },
);

if (mongoose.models.Footage) {
  delete mongoose.models.Footage;
}

const Footage: Model<FootageDocument> = mongoose.model<FootageDocument>(
  'Footage',
  footageSchema,
);

export {
  Footage,
  FootageZodSchema,
  FootageUpdateInputSchema,
  FootageCreateInputSchema,
  FootageRetrieveSchema,
};
export type {
  FootageZod,
  FootageDocument,
  FootageUpdateInput,
  FootageCreateInput,
  FootageRetrieveZod,
};
