import mongoose, { Document, Model, Schema } from 'mongoose';

type FootageDocument = Document & {
  uuid: string;
  discordId: number;
  username: string;
  youtubeUrl: string;
  isCsgoFootage: boolean;
  isAnalyzed: boolean;
};

type FootageInput = {
  uuid: FootageDocument['uuid'];
  username: FootageDocument['username'];
  discordId: FootageDocument['discordId'];
  youtubeUrl: FootageDocument['youtubeUrl'];
  isCsgoFootage: FootageDocument['isCsgoFootage'];
  isAnalyzed: FootageDocument['isAnalyzed'];
};

type FootageUpdateInput = {
  isCsgoFootage: FootageDocument['isCsgoFootage'];
  isAnalyzed: FootageDocument['isAnalyzed'];
};

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

export { Footage, FootageInput, FootageDocument, FootageUpdateInput };
