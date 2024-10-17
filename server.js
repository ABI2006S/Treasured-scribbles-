const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Autograph Schema
const autographSchema = new mongoose.Schema({
  name: String,
  message: String,
  signature: String,
  createdAt: { type: Date, default: Date.now },
});

const Autograph = mongoose.model('Autograph', autographSchema);

// Hash passwords
const saltRounds = 10;
const writePassword = 'Treasured123';
const readPassword = 'ABIN1JOHN';

const writePasswordHash = bcrypt.hashSync(writePassword, saltRounds);
const readPasswordHash = bcrypt.hashSync(readPassword, saltRounds);

// Routes
app.post('/api/autographs', async (req, res) => {
  try {
    const newAutograph = new Autograph(req.body);
    await newAutograph.save();
    res.status(201).json(newAutograph);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/autographs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = 10;
    const autographs = await Autograph.find()
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit);
    const total = await Autograph.countDocuments();
    res.json({
      autographs,
      nextCursor: page + 1 < Math.ceil(total / limit) ? page + 1 : null,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Password verification
app.post('/api/verify-password', async (req, res) => {
  const { type, password } = req.body;
  let isValid = false;

  if (type === 'write') {
    isValid = await bcrypt.compare(password, writePasswordHash);
  } else if (type === 'read') {
    isValid = await bcrypt.compare(password, readPasswordHash);
  }

  res.json({ isValid });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));