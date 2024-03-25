import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  }
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
