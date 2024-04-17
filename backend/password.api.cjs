const express = require('express');
const router = express.Router();
const PasswordModel = require('./db/password.model.cjs')

// http://localhost:8000/api/passwords
router.get('/', async (req, res) => {
    try {
        const passwords = await PasswordModel.getAllPasswords();
        res.json(passwords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// http://localhost:8000/api/passwords?id 
// const id = req.params.userId
// GET all passwords for a specific user
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
// http://localhost:8000/api/passwords/search/www.google.com
// http://localhost:8000/api/passwords/search?url=example.com&userId=123  (request param is optional)
router.get('/search/:url', async (req, res) => {
    try {
        // const { url, userId } = req.query;
        const url = req.params.url;
        // const password = await PasswordModel.findOne({ url, userId }).exec();
        // const password = await PasswordModel.getPasswordByUrl(url, userId);
        // Todo:::!!!! url + userId?? 
        const password = await PasswordModel.getPasswordByUrl(url);
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
//     // "userId": "",
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