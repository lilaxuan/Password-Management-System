const express = require('express');
const router = express.Router();
const UserModel = require('../db/user.model.cjs');

// Get all users in DB
// http://localhost:8000/api/users
router.get('/', async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Retrieve a user by ID
// http://localhost:8000/api/users/
router.get('/:id', async (req, res) => {
    try {
        const user = await UserModel.getUserById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Retrieve a user by username
// http://localhost:8000/api/users/by-username/Eric 
// the url has to be differeniated as the get request by user id!!! otherwise it'll always try to parse the username as an object id
router.get('/by-username/:username', async (req, res) => {
    try {
        const user = await UserModel.getUserByUsername(req.params.username);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a new user
// http://localhost/8000/api/users
// request body raw json data
// {"username": "xianer456", 
// "firstname": "jiaxuan", 
// "lastname": "li", 
// "email": "lijx.10089@gmail.com", 
// "phone": "1234567", 
// "password": "123456"}

// curl -X POST http://localhost:8000/api/users -H "Content-Type: application/json" -d '{"username": "xianer123", "firstname": "jiaxuan", "lastname": "li", "email": "lijx.10089@gmail.com", "phone": "1234567", "password": "123456"}'
router.post('/', async (req, res) => {
    try {
        const newUser = await UserModel.insertUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Update a user's information
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await UserModel.updateUser(req.params.id, req.body);
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DELETE: Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await UserModel.deleteUser(req.params.id);
        if (result.deletedCount === 0) {
            res.status(404).send('User not found');
        } else {
            res.send('The user has been deleted!');
            res.status(204).send(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 