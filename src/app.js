require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { globalLimiter } = require('./middlewares/rateLimiters');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

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
app.use('/api/orders', orderRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Middleware pour les routes non trouvées (doit être après toutes les routes)
app.use(notFound);

// Middleware de gestion globale des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;