const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }

  // Log the MongoDB URI
  console.log('MongoDB URI:', process.env.MONGODB_URI);

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client;
      callback(null, _db);
      // List all databases
      _db
        .db()
        .admin()
        .listDatabases()
        .then((response) => {
          const databases = response.databases;
          console.log('Databases from MongoClient connection:', databases);
        });
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
