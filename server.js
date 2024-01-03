const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const process = require('dotenv').config();
const uri =`mongodb+srv://${process.parsed.user}:${process.parsed.password}@cluster0.2oml3rz.mongodb.net/ToDoApp?retryWrites=true&w=majority`;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = 5000 || process.parsed.port;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
// mongoose.set('useCreateIndex', true);

const db = mongoose.connection;

//UserSchema is defined
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// TaskSchema is defined
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

app.post('/api/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { token } = req.headers;
    const { task } = req.body;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'your-secret-key');
    const userId = decodedToken.userId;

    const newTask = new Task({ userId, task });
    await newTask.save();

    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', async (req, res) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, 'your-secret-key');
    const userId = decodedToken.userId;

    const tasks = await Task.find({ userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});