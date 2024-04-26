const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shareRequestSchema = new Schema({
    passwordId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Password'
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recipientId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'refused'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });
module.exports = shareRequestSchema;
