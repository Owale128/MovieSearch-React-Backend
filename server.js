const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const User = require('./userModel')
const bcrypt = require('bcryptjs');
const auth = require('./auth')
const app = express();


const PORT = process.env.PORT || 5000;
app.use(bodyparser.json());
app.use(cors());


app.get('/', auth, async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
        console.log('Error fetching users', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not mtach');
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('UserName already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, password: hashedPassword});
    await user.save();
    res.status(201).send('User registered successfully');
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) {
        return res.status(400).send('Invalid username or password');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword) {
        return res.status(400).send('Invalid username or password');
    }

    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`servier is running on ${PORT}`)
})