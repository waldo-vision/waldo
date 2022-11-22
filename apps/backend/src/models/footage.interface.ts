import { z } from 'express-zod-api';
import mongoose, { Document, Model, Schema } from 'mongoose';

type FootageDocument = Document & {
  uuid: string;
  discordId: number;
  youtubeUrl: string;
  footageType: string;
  upVotes: number;
  downVotes: number;
  isAnalyzed: boolean;
};

const FootageZodSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  youtubeUrl: z.string().url(),
  footageType: z.string(),
  upVotes: z.number().optional(),
  downVotes: z.number().optional(),
  isAnalyzed: z.boolean(),
});

const FootageRetrieveSchema = z.object({
  footage: z.array(FootageZodSchema),
});

type FootageZod = z.infer<typeof FootageZodSchema>;
type FootageRetrieveZod = z.infer<typeof FootageRetrieveSchema>;
const FootageUpdateInputSchema = z.object({
  uuid: z.string().uuid(),
  footageType: z.string(),
  isAnalyzed: z.boolean(),
});

type FootageUpdateInput = z.infer<typeof FootageUpdateInputSchema>;
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
    footageType: {
      type: Schema.Types.String,
      required: true,
      default: 'csgo',
    },
    isAnalyzed: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    upVotes: {
      type: Schema.Types.Number,
      required: false,
      default: 0,
    },
    downVotes: {
      type: Schema.Types.Number,
      required: false,
      default: 0,
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

const FootageTypeEnum = z.enum(['VAL', 'CSG', 'TF2', 'APE', 'COD']);
type FootageTypeEnumZod = z.infer<typeof FootageTypeEnum>;

export {
  Footage,
  FootageZodSchema,
  FootageUpdateInputSchema,
  FootageRetrieveSchema,
  FootageTypeEnum,
};
export type {
  FootageZod,
  FootageDocument,
  FootageUpdateInput,
  FootageRetrieveZod,
  FootageTypeEnumZod,
};
