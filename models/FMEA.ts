import mongoose, { Schema, model, models } from 'mongoose';
import { FMEA } from '@/types/fmea-analysis-types';

const fmeaSchema = new Schema<FMEA>({
    id: { type: String, required: true, unique: true },
    components: [{ type: String }],
    mainEquipment: { type: String, required: true },
    operatingCondition: String,
    availabilityTarget: Number,
    redundancy: String,
    fmeaNumber: { type: String, required: true },
    preparedBy: String,
    lastUpdatedBy: String,
    fmeaDate: String,
    revision: String,
    failureModeCategory: String,
    additionalDescription: String,
    failureMechanism: String,
    failureCause: String,
    failureCauseDescription: String,
    failureEffect: String,
    failureConsequences: [{ type: String }],
    consequencePeople: String,
    consequenceEnvironment: String,
    consequenceAsset: String,
    consequenceReputation: String,
    probability: String,
    mitigatedRisk: String,
    mitigationActions: [{ type: String }],
    spareParts: { type: String, enum: ['Y', 'N'] },
    taskType: String,
    frequency: String,
    mainWorkCenter: String,
    isShutdownRequired: Boolean,
    mitigatedRiskRating: String,
    taskOriginReferences: String,
    remarks: String,
}, { timestamps: true });

const FmeaModel = models.FMEA || model<FMEA>('FMEA', fmeaSchema);
export default FmeaModel; 