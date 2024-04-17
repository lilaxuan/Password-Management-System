const express = require('express');
const router = express.Router();
const PasswordModel = require('./db/password.model.cjs')

// Get all password records in DB
// http://localhost:8000/api/passwords
router.get('/', async (req, res) => {
    try {
        const passwords = await PasswordModel.getAllPasswords();
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET password by id
// http://localhost:8000/api/passwords/661f6451470c3f5e1c00954e
// const id = req.params.userId
router.get('/:id', async (req, res) => { // In the Get request function header, it defines the request param 'userId' (optional)
    try {
        const id = req.params.id;
        // const passwords = await PasswordModel.find({ userId }).exec(); // this is equailvant to the line below, where we defined the method in the data model
        const passwords = await PasswordModel.getPasswordById(id);
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET a password by URL and userId
// for router.get('/search/:url', async (req, res) =>  http://localhost:8000/api/passwords/search/www.google.com 
// for router.get('/search/', async (req, res) => http://localhost:8000/api/passwords/search?url=www.google.com&userId=661f61174a6e192cc2d6dbcd  
// for router.get('/search/:url/:userId', async (req, res) => http://localhost:8000/api/passwords/search/www.google.com/661f61174a6e192cc2d6dbcd
router.get('/search/:url/:userId', async (req, res) => {
    try {
        // const url = req.params.url;
        // const { url, userId } = req.query;
        const { url, userId } = req.params;
        if (!url || !userId) {
            return res.status(400).send("Both URL and User ID are required.");
        }

        const password = await PasswordModel.getPasswordByUrl(url, userId);
        // const password = await PasswordModel.getPasswordByUrl(url);

        if (password) {
            res.json(password);
        } else {
            res.status(404).send('Password not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST/Create a new password
// http://localhost:8000/api/passwords
// request body json: 
// {
//     "userId": "661f644f470c3f5e1c00954c",
//     "url": "www.google.com",
//     "username": "xianer",
//     "password": "123456"
// }
router.post('/', async (req, res) => {
    try {
        const { userId, url, username, password } = req.body;
        const newPassword = await PasswordModel.addNewPassword({ userId, url, username, password });
        res.status(201).json(newPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT to update a password record
// http://localhost:8000/api/passwords/id
// request body json: partial info is okay
// {
//     "userId": "",
//     "url": "",
//     "username": "",
//     "password": ""
// }
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const passwordData = req.body;
    try {
        const updatedPassword = await PasswordModel.updatePassword(id, passwordData);
        if (updatedPassword) {
            res.json(updatedPassword);
        } else {
            res.status(404).send('Password not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a password record
// http://localhost:8000/api/passwords/id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletePasswordResponse = await PasswordModel.deletePassword(id);
        res.send('The password record has been deleted!');
        res.status(204).send(deletePasswordResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;