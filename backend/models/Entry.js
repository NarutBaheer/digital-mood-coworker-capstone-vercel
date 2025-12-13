const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  mood: { type: Number, min: 0, max: 10, required: true },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Entry', EntrySchema);
