const express = require('express');
const cors = require('cors');
const path = require('path');
const templateRoutes = require('./routes/templateRoutes');
const authRoutes = require('./routes/authRoutes');
const designRoutes = require('./routes/designRoutes');
const spiderRoutes = require('./routes/spiderRoutes');
const docsRoutes = require('./routes/docsRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.json({
    code: 0,
    message: '创客贴 mock backend is running',
    data: {
      health: 'ok',
    },
  });
});

app.get('/interfaces', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/interfaces.html'));
});

app.use('/api', templateRoutes);
app.use('/api', authRoutes);
app.use('/api', designRoutes);
app.use('/api', spiderRoutes);
app.use('/api', docsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`创可贴后端运行在 http://localhost:${port}`);
  });
}