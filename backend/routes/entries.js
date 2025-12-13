const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Entry = require('../models/Entry');

// Create
router.post('/', auth, async (req, res) => {
  try {
    const { date, mood, note } = req.body;
    const entry = new Entry({ user: req.user.id, date: date || Date.now(), mood, note });
    await entry.save();
    res.json(entry);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' });}
});

// List
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' });}
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if(!entry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' });}
});

module.exports = router;
