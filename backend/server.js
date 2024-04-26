const express = require('express');
const passwords = require('./apis/password.api.cjs');
const users = require('./apis/user.api.cjs');
const shareRequests = require('./apis/share.request.api.cjs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser') // todo: import later on
const app = express();
const path = require('path');
const cors = require('cors');


// Notes: When Creating db, no need to pre-set up schema
const mongoDBEndpoint = 'mongodb+srv://admin:xianer123@password-management-sys.cacpwcb.mongodb.net/?retryWrites=true&w=majority&appName=Password-Management-System-DB';
mongoose.connect(mongoDBEndpoint, {
    useNewUrlParser: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));

// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/passwords', passwords); // defined the base root url for the API
app.use('/api/users', users); // defined the base root url for the API
app.use('/api/share', shareRequests); // defined the base root url for the API
app.use(bodyParser.json());
app.use(express.static('public')); // use static files in public
app.use(cors());


// set up front end directory
let frontend_dir = path.join(__dirname, '..', 'frontend', 'dist')
app.use(express.static(frontend_dir));
app.get('*', function (req, res) {
    console.log("received request");
    res.sendFile(path.join(frontend_dir, "index.html"));
});

app.get('/', function (req, res) {
    res.send("This is the FIRST GET request")
});

app.get('/', function (request, response) {
    response.send("This is SECOND GET request");
})

app.put('/', function (request, response) {
    response.send("This is a PUT request")
})

app.listen(8000, function () {
    console.log("Starting app now...")
})