const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 2410;

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const DB = 'mongodb+srv://abhay199901:Abhay%4078@cluster0.ncqp3vb.mongodb.net/UserDb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const usernoteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    notes: [{
        title: String,
        description: String,
    }]
});

const User = mongoose.model('UserNotes', usernoteSchema);

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id, email: user.email }, 'jwtPrivateKey', { expiresIn: '1h' });
    return token;
};

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send('Bad Request: Missing required fields.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Bad Request: Missing required fields.');
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid email or password.');
        }
        const name = user.name
        const id = user._id
        console.log(name)
        const token = generateAuthToken(user);
        res.send({ token, name, id });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, 'jwtPrivateKey');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

app.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users/:userId/notes/:noteId', auth, async (req, res) => {
    try {
        const { userId, noteId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const note = user.notes.id(noteId);
        if (!note) {
            return res.status(404).send('Note not found');
        }

        res.send(note);
    } catch (error) {
        console.error('Error retrieving note:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/users/:userId/notes', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).send('Bad Request: Missing required fields.');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.notes.push({ title, description });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.put('/users/:userId/notes/:noteId', auth, async (req, res) => {
    try {
        const { userId, noteId } = req.params;
        const { title, description } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const note = user.notes.id(noteId);
        if (!note) {
            return res.status(404).send('Note not found');
        }

        note.title = title || note.title;
        note.description = description || note.description;

        await user.save();
        res.send(user);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.delete('/users/:userId/notes/:noteId', auth, async (req, res) => {
    try {
        const { userId, noteId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const noteIndex = user.notes.findIndex(note => note._id.toString() === noteId);
        if (noteIndex === -1) {
            return res.status(404).send('Note not found');
        }

        user.notes.splice(noteIndex, 1);
        await user.save();

        res.send(user);
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.delete('/users/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send('User not found');
        }

        res.send(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
