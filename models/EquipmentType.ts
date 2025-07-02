import mongoose, { Schema, Document, Model } from 'mongoose';
import { systemSchema } from './System';

export interface IEquipmentType extends Document {
  name: string;
  description?: string;
  equipmentClassId: Schema.Types.ObjectId;
  systems: any[];
}

const equipmentTypeSchema = new Schema<IEquipmentType>({
  name: { type: String, required: true },
  description: { type: String },
  equipmentClassId: { type: Schema.Types.ObjectId, ref: 'EquipmentClass', required: true },
  systems: { type: [Object], default: [] },
});

const EquipmentType: Model<IEquipmentType> = mongoose.models.EquipmentType || mongoose.model<IEquipmentType>('EquipmentType', equipmentTypeSchema);
export default EquipmentType; 