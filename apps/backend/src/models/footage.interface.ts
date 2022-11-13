import { z } from 'express-zod-api';
import mongoose, { Document, Model, Schema } from 'mongoose';

type FootageDocument = Document & {
  uuid: string;
  discordId: number;
  username: string;
  youtubeUrl: string;
  isCsgoFootage: boolean;
  isAnalyzed: boolean;
};

const FootageZodSchema = z.object({
  uuid: z.string().uuid(),
  discordId: z.number(),
  username: z.string(),
  youtubeUrl: z.string().url(),
  isCsgoFootage: z.boolean(),
  isAnalyzed: z.boolean(),
});

const FootageRetrieveSchema = z.object({
  footage: z.array(FootageZodSchema),
});

type FootageZod = z.infer<typeof FootageZodSchema>;
type FootageRetrieveZod = z.infer<typeof FootageRetrieveSchema>;
const FootageUpdateInputSchema = z.object({
  uuid: z.string().uuid(),
  isCsgoFootage: z.boolean(),
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
    username: {
      type: Schema.Types.String,
      required: true,
    },
    discordId: {
      type: Schema.Types.Number,
      required: true,
    },
    youtubeUrl: {
      type: Schema.Types.String,
      required: true,
    },
    isCsgoFootage: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    isAnalyzed: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
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
  FootageRetrieveSchema,
};
export type {
  FootageZod,
  FootageDocument,
  FootageUpdateInput,
  FootageRetrieveZod,
};
