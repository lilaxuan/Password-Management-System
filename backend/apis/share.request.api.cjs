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
        // const { passwordId, recipientId } = req.body;
        // const ownerId = req.params.ownerId;
        // const recipient = await UserModel.getUserById(recipientId);

        const newShareReuqest = req.body;
        console.log('newShareRequest: ', newShareReuqest);
        // Todo: check uniqueness of owner id and share id. 
        await ShareRequestModel.createNewShareReuqest(newShareReuqest);

        // console.log('ownerId: ', ownerId);
        // console.log('receipientId: ', recipientId);
        // console.log('recipient user: ', recipient);

        // if (!recipient) {
        //     return res.status(404).send('Recipient user not found.');
        // }

        // const shareRequest = new ShareRequestModel({
        //     passwordId,
        //     ownerId,
        //     recipientId: recipient._id,
        //     status: 'pending'
        // });
        // console.log('the share request is: ', shareRequest);

        // await shareRequest.save();
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
//     "ownerUsername": "emma111",
//     "recipientId": "6629fa6cd3ebb86812cf6ed6",
//     "recipientUsername": "Eric",
//     "status": "accepted"
// }
router.put('/accept/:id', async (req, res) => {
    try {
        const shareRequestId = req.params.id;
        const newShareRequest = req.body;
        await ShareRequestModel.updateShareRequest(shareRequestId, newShareRequest);

        // const recipientId = req.params.recipientId;
        // const shareRequest = await ShareRequestModel.findOneAndUpdate({
        //     _id: id,
        //     // no ownerId needed? 
        //     recipientId: recipientId,
        //     status: 'pending'
        // }, { status: 'accepted' }, { new: true });

        // Save the accepted password for the recipientUser
        const recipientId = newShareRequest.recipientId
        const recipientUser = await UserModel.getUserById(recipientId);
        console.log('recipientUser: ', recipientUser);
        if (!recipientUser) {
            return res.status(404).send('Recipient user not found.');
        }
        const sharedUser = await UserModel.getUserById(newShareRequest.ownerId);
        if (!sharedUser) {
            return res.status(404).send('Share user not found.');
        }

        recipientUser.receivedPasswords.push({
            passwordId: newShareRequest.passwordId,
            sharedUserId: sharedUser._id,
            sharedUsername: sharedUser.username
        });

        await recipientUser.save(); // Directly save the model if using Mongoose


        // console.log('recipientUser - current status1: ', recipientUser);
        // const receivedPasswords = recipientUser.receivedPasswords;
        // console.log('recipientUser - receivedPasswords: ', receivedPasswords);
        // Update the recipientUser's receivedPasswords by calling the PUT API
        // const updatedReceivedPasswords = { receivedPasswords: receivedPasswords };
        // console.log('recipientId: ', recipientId);
        // await axios.put(`/api/users/${recipientId}`, updatedReceivedPasswords);  // not working

        console.log('recipientUser - current status2: ', recipientUser);

        res.send('Share request accepted and password saved.');

        // if (!shareRequest) {
        //     return res.status(404).send('Share request not found or already handled.');
        // }
    } catch (error) {
        res.status(500).send('Error accepting share request.');
    }
});



// PUT(update): Refuse a share request
// http://localhost/8000/api/share/refuse/:id
// {
//     "passwordId": "66298c8586fab88f27956df7",
//     "ownerId" : "66200f4a97eeef38f24c2af6",
//     "ownerUsername": "emma111",
//     "recipientId": "6629fa6cd3ebb86812cf6ed6",
//     "recipientUsername": "Eric",
//     "status": "refused"
// }
router.put('/refuse/:id', async (req, res) => {

    try {
        const shareRequestId = req.params.id;
        const newShareRequest = req.body;
        await ShareRequestModel.updateShareRequest(shareRequestId, newShareRequest);
        // const recipientId = req.params.recipientId;
        // const shareRequest = await ShareRequestModel.findOneAndUpdate({
        //     _id: id,
        //     recipientId: recipientId,
        //     status: 'pending'
        // }, { status: 'refused' }, { new: true });

        // if (!shareRequest) {
        //     return res.status(404).send('Share request not found or already handled.');
        // }

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