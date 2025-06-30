import mongoose, { Schema, model, models } from 'mongoose';
import { Task } from '@/types/equipment-types';

const taskSchema = new Schema<Task>({
  id: { type: String, required: true, unique: true },
  taskList: String,
  sapGTL: String,
  mainWorkCenter: String,
  interval: String,
  taskType: { type: String, required: true },
  taskDescription: String,
  numberOfPerson: Number,
  manHour: Number,
  equipmentClassId: String,
});

const TaskModel = models.Task || model<Task>('Task', taskSchema);
export default TaskModel; 