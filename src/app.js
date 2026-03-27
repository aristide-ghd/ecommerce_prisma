require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { globalLimiter } = require('./middlewares/rateLimiters');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Sécurité headers
app.use(helmet());

// Middlewares de base
app.use(express.json());
app.use(cors());

// Rate limit global pour l'application
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running');
});

module.exports = app;