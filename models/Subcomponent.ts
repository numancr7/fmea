import { Schema } from 'mongoose';

export const subcomponentSchema = new Schema({
  name: { type: String, required: true },
  remarks: { type: String }
}); 