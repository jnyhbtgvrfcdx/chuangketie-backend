const express = require('express');
const cors = require('cors');
const templateRoutes = require('./routes/templateRoutes');
const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    code: 0,
    message: '创客贴 mock backend is running',
    data: {
      health: 'ok',
    },
  });
});

app.use('/api', templateRoutes);
app.use('/api', authRoutes);
app.use('/api', designRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
