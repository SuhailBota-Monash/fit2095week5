let express = require('express');
const morgan = require('morgan');
let bodyParser = require('body-parser');
let app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/';

//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Connect to MongoDB
let db;
MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('FIT2095');
        }
});


//Setup Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setup the static assets directories
app.use(morgan('tiny'));
app.use(express.static('css'));
app.get('/', function (req, res) {
    res.render('index.html');
});
app.get('/newtask', function (req, res) {
    res.render('newtask.html');
});

app.get('/listtasks', function (req, res) {
    db.collection('tasks').find({}).toArray(function (err, data) {
        res.render('listtasks.html', {listDb: data});
    });
});

app.get('/updatetasks', function (req, res) {
    res.render('updatetasks.html');
});

app.get('/deletetasks', function (req, res) {
    res.render('deletetasks.html');
});

app.post('/data', function (req, res) {
    let taskDetails = req.body;
    db.collection('tasks').insertOne({_id: taskDetails.taskId, taskName: taskDetails.taskName, taskAssign: taskDetails.taskAssign, taskDueDate: taskDetails.taskDueDate, taskStatus: taskDetails.taskStatus, taskDescription: taskDetails.taskDescription });
    res.render('newtask.html');
});

app.post('/updateTask', function (req, res) {
    let taskDetails = req.body;
    let filter = {_id: taskDetails.taskid};
    let update = {$set: {taskStatus: taskDetails.taskStatus}};
    db.collection('tasks').updateOne(filter, update);
    res.render('updatetasks.html');
});

app.post('/deletetask', function (req, res) {
    let taskDetails = req.body;
    let filter = {_id: taskDetails.taskid};
    db.collection('tasks').deleteOne(filter);
    res.render('deletetasks.html');
});





app.listen(8080);