// const Schema = require('mongoose').Schema;
// module.exports = new Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     color: String,
//     owner: String,
//     created: {
//         type: Date,
//         default: Date.now
//     }
// }, { collection: 'pokemonSpr2024' });

const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true // primary key
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Mongoose will create a new model. This model will correspond to a collection named users in the MongoDB database 
// (Mongoose will automatically convert the model name User to lowercase and pluralize it (users) as the collection name). 
// If the collection does not exist, it will be created when you first insert the document.
module.exports = mongoose.model('User', userSchema);