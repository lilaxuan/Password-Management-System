const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PasswordModel = require('../db/password.model.cjs');
console.log("Password Model: ", PasswordModel);


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

// Get a user by userId
router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid user ID format');
    }

    try {
        // const passwords = await PasswordModel.find({ userId });
        const passwords = await PasswordModel.getPasswordByUserId(userId);
        res.status(200).json(passwords);
    } catch (error) {
        console.error('Error retrieving passwords for userId:', userId, error);
        res.status(500).json({ message: "Error retrieving passwords", error: error.message });
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
        console.log('create a new password record!!');
        const { userId, url, username, password } = req.body;

        // Check if a password entry with the same userId and URL already exists
        // const existingEntry = await PasswordModel.findOne({ userId, url }); // not working
        const existingEntry = await PasswordModel.checkUniqueUrlUser(userId, url);

        if (existingEntry) {
            console.log('Duplicate url entries not allowed');
            return res.status(409).json({ message: 'An entry with this userId and URL already exists.' }); // has to return; otherwise, server will crash since res already sent status code
        }
        console.log('333: ', existingEntry);

        const newPassword = await PasswordModel.addNewPassword({ userId, url, username, password });
        res.status(201).json(newPassword);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT to update a password record based on password id
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
    const newPasswordData = req.body;
    try {
        // check uniqueness of userId + url
        const existingPassword = await PasswordModel.getPasswordById(id);
        const userId = existingPassword.userId;
        const existingEntry = await PasswordModel.findRecordByUrlAndUserExcludeExisting(userId, newPasswordData.url, id);
        if (existingEntry) {
            console.log('Duplicate url entries not allowed, cannot update this entry!');
            return res.status(409).json({ message: 'Another entry with the same userId and URL already exists.' });
        }

        const updatedPassword = await PasswordModel.updatePassword(id, newPasswordData);
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
        await PasswordModel.deletePassword(id);
        res.send('The password record has been deleted!');
    } catch (error) {
        console.error('Failed to fetch passwords for user:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;