const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    skillsOffered: [String],
    skillsNeeded: [String]
});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Skill Trading Platform API');
});

// Add a user
app.post('/users', async (req, res) => {
    const { username, email, skillsOffered, skillsNeeded } = req.body;
    try {
        const user = new User({ username, email, skillsOffered, skillsNeeded });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Error saving user' });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

