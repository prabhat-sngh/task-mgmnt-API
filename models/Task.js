import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  status: { type: String, enum: ['TODO', 'DONE'], default: 'TODO' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);

