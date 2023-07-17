import {MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URL;
const databaseName = "nishita-blog";
let _db;

function connectToDB (cb) {
    MongoClient.connect(url)
    .then((client) => {
        _db = client.db(databaseName);
        console.log("Database Successfully Connected!");
        return cb(null);
    })
    .catch(err => {
        return cb(err);
    })
}

function getDb () {
    return _db;
}

export default {connectToDB, getDb};