import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const failureCauseSchema = new Schema({
  id: { type: String, required: true, unique: true, default: uuidv4 },
  causeCode: { type: String, required: true },
  causeName: { type: String, required: true },
  causeDescription: { type: String, default: '' },
}, {
  timestamps: true,
});

// Auto-generate UUID before saving
failureCauseSchema.pre('save', function(next) {
  if (!this.isNew) return next();
  
  // Generate UUID if not provided
  if (!this.id) {
    this.id = uuidv4();
  }
  next();
});

const FailureCauseModel = models.FailureCause || model('FailureCause', failureCauseSchema);
export default FailureCauseModel; 