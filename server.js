const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI);

// Схема для истории оценок
const storySchema = new mongoose.Schema({
  story: String,
  estimates: [Number],
  createdAt: { type: Date, default: Date.now }
});
const Story = mongoose.model('Story', storySchema);

// Сохранить новую оценку
app.post('/estimate', async (req, res) => {
  const { story, estimates } = req.body;
  const newStory = new Story({ story, estimates });
  await newStory.save();
  res.json({ message: 'Оценка сохранена' });
});

// Получить историю оценок
app.get('/history', async (req, res) => {
  const history = await Story.find().sort({ createdAt: -1 }).limit(20);
  res.json(history);
});

app.listen(3000, () => console.log('Сервер запущен на 3000'));