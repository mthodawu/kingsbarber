import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
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
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barber',
    default: null,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  confirmationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
