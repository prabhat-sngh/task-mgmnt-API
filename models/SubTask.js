import mongoose from 'mongoose';

const subTaskSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  status: { type: Number, enum: [0, 1], default: 0 },
  deleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('SubTask', subTaskSchema);

