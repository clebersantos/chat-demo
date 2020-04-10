const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://' + process.env.MONGO_CONNECTION;
const dbName = process.env.MONGO_DB;
const dbParams = { useNewUrlParser: true, useUnifiedTopology: true };

MongoClient.connect(url, dbParams, (err, conn) => {
    if (err) return console.log('error', err);

    // Storing a reference to the database so you can use it later
    global.conn = conn.db(dbName);
    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database: ${dbName}`);
})

const TAMANHO_PAGINA = 10;

var ObjectId = require("mongodb").ObjectId;

function findAll(pagina, callback) {
    const tamanhoSkip = TAMANHO_PAGINA * (pagina - 1);
    global.conn.collection("users").find({})
        .skip(tamanhoSkip)
        .limit(TAMANHO_PAGINA)
        .toArray(callback);
}

//callback deve considerar error e count
function countAll(callback) {
    global.conn.collection("users").count(callback);
}

function insert(user, callback) {
    global.conn.collection("users").insert(user, callback);
}

function findOne(id, callback) {
    global.conn.collection("users").find(new ObjectId(id)).toArray(callback);
}

function findUserByName(username, callback){
    global.conn.collection("users").findOne({"username": username}, function(err, doc){
        callback(err, doc);
    });
}

function findUserById(id, callback){
    global.conn.collection("users").findOne({_id: ObjectId(id) }, (err, doc) => {
        callback(err, doc);
    });
}

function update(id, user, callback) {
    global.conn.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: user }, callback);
}

function deleteOne(id, callback) {
    global.conn.collection("users").deleteOne({ _id: new ObjectId(id) }, callback);
}

module.exports = {
    findAll,
    insert,
    findOne,
    findUserByName,
    findUserById,
    update,
    deleteOne,
    countAll,
    TAMANHO_PAGINA
}