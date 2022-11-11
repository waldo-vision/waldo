import { Document, Model } from 'mongoose';
declare type FootageDocument = Document & {
  uuid: string;
  discordId: number;
  username: string;
  youtubeUrl: string;
  isCsgoFootage: boolean;
  isAnalyzed: boolean;
};
declare type FootageInput = {
  uuid: FootageDocument['uuid'];
  username: FootageDocument['username'];
  discordId: FootageDocument['discordId'];
  youtubeUrl: FootageDocument['youtubeUrl'];
  isCsgoFootage: FootageDocument['isCsgoFootage'];
  isAnalyzed: FootageDocument['isAnalyzed'];
};
declare type FootageUpdateInput = {
  isCsgoFootage: FootageDocument['isCsgoFootage'];
  isAnalyzed: FootageDocument['isAnalyzed'];
};
declare const Footage: Model<FootageDocument>;
export { Footage };
export type { FootageInput, FootageDocument, FootageUpdateInput };
//# sourceMappingURL=footage.interface.d.ts.map
