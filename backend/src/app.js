// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// 🔴 DB init
require('./config/db');

const app = express();

// 🔴 MUST be BEFORE routes
app.use(cors());
app.use(helmet());
app.use(express.json()); // <-- THIS IS NON-NEGOTIABLE
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/test', require('./routes/test.routes'));
app.use('/api/tenders', require('./routes/tenders.routes'));



app.get('/', (req, res) => {
  res.json({ message: 'Tender Automation Backend Running' });
});

module.exports = app;
