const express = require('express');
const router = express.Router();
const ShareRequestModel = require('../db/share.request.model.cjs');
const UserModel = require('../db/user.model.cjs');

// Get all share requests in DB
// http://localhost:8000/api/share
router.get('/', async (req, res) => {
    try {
        const shareRequests = await ShareRequestModel.getAllShareRequests();
        res.json(shareRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Retrieve a share request by ID
// http://localhost:8000/api/share/36194979
router.get('/:id', async (req, res) => {
    try {
        const shareRequestId = req.params.id;
        const shareRequest = await ShareRequestModel.getShareReuqestById(shareRequestId);
        if (shareRequest) {
            res.json(shareRequest);
        } else {
            res.status(404).send('Share request not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Create a new share reuqest - send to other users
// http://localhost/8000/api/share/send/:ownerId
// request body raw json data
// {
//     "passwordId": "66298c8586fab88f27956df7",
//     "ownerId" : "66200f4a97eeef38f24c2af6",
//     "recipientId": "6629fa6cd3ebb86812cf6ed6",
//     "status": "pending"
// }
router.post('/send', async (req, res) => {
    try {
        const newShareRequest = req.body;
        console.log('newShareRequest: ', newShareRequest);
        // Todo: check uniqueness of owner id and share id. 
        // await ShareRequestModel.createNewShareReuqest(newShareRequest);

        const createdShareRequest = await ShareRequestModel.createNewShareRequest(newShareRequest);


        // Save the shared password for the recipientUser (With pending status)
        const recipientId = newShareRequest.recipientId;
        const recipientUser = await UserModel.getUserById(recipientId);
        if (!recipientUser) {
            return res.status(404).send('Recipient user not found.');
        }

        const sharedUser = await UserModel.getUserById(newShareRequest.ownerId);
        if (!sharedUser) {
            return res.status(404).send('Share user not found.');
        }

        // Todo: check if this share request has been sent, no duplicated share request allowed
        console.log("recipientUser111: ", recipientUser);
        console.log('hihihi- createdShareRequest: ', createdShareRequest);
        recipientUser.receivedPasswords.push({
            sharedReuqestId: createdShareRequest._id,
            passwordId: newShareRequest.passwordId,
            sharedUserId: sharedUser._id,
            sharedUsername: sharedUser.username,
            status: 'pending'
        });
        console.log("recipientUser222: ", recipientUser);
        await recipientUser.save(); // Directly save the model if using Mongoose; Sometimes need to delete some entries in the database, so that the save could work
        console.log('Updated recipientUser: ', recipientUser);
        res.status(201).send('Share request sent.');
    } catch (error) {
        res.status(500).send('Error sending share request.');
    }
});


// PUT(update): Accept a share request; update share request status by share request id
// http://localhost:8000/api/share/accept/662ab4be0a7d6a72248b3d5c
// {
//     "passwordId": "66298c8586fab88f27956df7",
//     "ownerId" : "66200f4a97eeef38f24c2af6",
//     "recipientId": "6629fa6cd3ebb86812cf6ed6",
//     "status": "accepted"
// }
router.put('/accept/:id', async (req, res) => {
    try {
        const shareRequestId = req.params.id;
        console.log("shareRequestId: ", shareRequestId);
        const newShareRequest = req.body;
        await ShareRequestModel.updateShareRequest(shareRequestId, newShareRequest);
        console.log("udpated -11111: ", newShareRequest);


        // Update the received password status to 'accepted' for the recipientUser
        const recipientId = newShareRequest.recipientId
        const recipientUser = await UserModel.getUserById(recipientId);
        if (!recipientUser) {
            return res.status(404).send('Recipient user not found.');
        }
        const sharedUser = await UserModel.getUserById(newShareRequest.ownerId);
        if (!sharedUser) {
            return res.status(404).send('Share user not found.');
        }

        // cannot do this, since it will create a new entry in the received passwords
        // recipientUser.receivedPasswords.push({
        //     shareRequestId: shareRequestId,
        //     passwordId: newShareRequest.passwordId,
        //     sharedUserId: sharedUser._id,
        //     sharedUsername: sharedUser.username,
        //     status: "accepted"
        // });

        // Check if an entry exists with the shareRequestId
        let entryFound = false;
        recipientUser.receivedPasswords.forEach(password => {
            if (password.sharedReuqestId.toString() === shareRequestId) {
                password.status = "accepted";  // Update status to accepted
                entryFound = true;
            }
        });

        // If no entry is found, optionally handle this as an error or add the entry
        if (!entryFound) {
            return res.status(404).send('No corresponding share request entry found in recipient.');
        }
        console.log('hihihi2-recipientUser: ', recipientUser);
        await recipientUser.save(); // Directly save the model if using Mongoose
        console.log('Updated recipientUser: ', recipientUser);
        res.send('Share request accepted and password saved.');
    } catch (error) {
        res.status(500).send('Error accepting share request.');
    }
});



// PUT(update): Refuse a share request
// http://localhost/8000/api/share/refuse/:id
// {
//     "passwordId": "66298c8586fab88f27956df7",
//     "ownerId" : "66200f4a97eeef38f24c2af6",
//     "ownerUsername": "emma",
//     "recipientId": "6629fa6cd3ebb86812cf6ed6",
//     "recipientUsername": "Eric",
//     "status": "refused"
// }
router.put('/refuse/:id', async (req, res) => {

    try {
        const shareRequestId = req.params.id;
        const newShareRequest = req.body;
        await ShareRequestModel.updateShareRequest(shareRequestId, newShareRequest);
        // Update the received password status to 'refused' for the recipientUser
        const recipientId = newShareRequest.recipientId
        const recipientUser = await UserModel.getUserById(recipientId);
        if (!recipientUser) {
            return res.status(404).send('Recipient user not found.');
        }
        const sharedUser = await UserModel.getUserById(newShareRequest.ownerId);
        if (!sharedUser) {
            return res.status(404).send('Share user not found.');
        }

        let entryFound = false;
        recipientUser.receivedPasswords.forEach(password => {
            if (password.sharedReuqestId.toString() === shareRequestId) {
                password.status = "refused";  // Update status to accepted
                entryFound = true;
            }
        });

        // If no entry is found, optionally handle this as an error or add the entry
        if (!entryFound) {
            return res.status(404).send('No corresponding share request entry found in recipient.');
        }

        await recipientUser.save(); // Directly save the model if using Mongoose

        res.send('Share request refused.');
    } catch (error) {
        res.status(500).send('Error refusing share request.');
    }
});



// PUT: Update a share request's information
router.put('/:id', async (req, res) => {
    try {
        const updatedShareRequest = await ShareRequestModel.updateShareRequest(req.params.id, req.body);
        if (updatedShareRequest) {
            res.json(updatedShareRequest);
        } else {
            res.status(404).send('Share request not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// DELETE: Delete a share request by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await ShareRequestModel.deleteShareReuqest(req.params.id);
        if (result.deletedCount === 0) {
            res.status(404).send('Share Request not found');
        } else {
            res.send('The share request has been deleted!');
            res.status(204).send(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 