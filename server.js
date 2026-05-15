require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const receiptRoutes = require('./routes/receiptRoutes');
const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/receipts', receiptRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RanaPay Backend Running Successfully',
  });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});