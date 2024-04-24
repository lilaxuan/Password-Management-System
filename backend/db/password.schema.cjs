const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, // unique id auto-generated in MongoDB for each user, it's different as username 
        ref: 'User', // links to 'users' table in the db
        required: true
    },
    url: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index on userId and url so that one url of each user can only have one record
passwordSchema.index({ userId: 1, url: 1 }, { unique: true });

// Mongoose will create a new model. This model will correspond to a collection named users in the MongoDB database 
// (Mongoose will automatically convert the model name User to lowercase and pluralize it (passwords) as the collection name). 
// If the collection does not exist, it will be created when you first insert the document.
// module.exports = mongoose.model('Password', passwordSchema);
module.exports = passwordSchema;