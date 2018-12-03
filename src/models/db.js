let mongoose = require('mongoose');

const { database, secret } = require('../config');
mongoose.Promise = global.Promise;
mongoose.connect(database,{ useNewUrlParser: true });
var db = mongoose.connection;
// console.log("db", db)

db.on('connected', function () {
    console.log("Mongoose default connection is open to ", database);
});

db.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose;