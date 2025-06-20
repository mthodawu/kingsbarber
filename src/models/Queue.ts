import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
    enum: ['haircut', 'beard-trim', 'haircut-beard', 'shave', 'styling'],
  },
  position: {
    type: Number,
    required: true,
  },
  estimatedWait: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'left'],
    default: 'waiting',
  },
  confirmationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Queue = mongoose.models.Queue || mongoose.model('Queue', QueueSchema);
