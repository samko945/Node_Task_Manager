/*  start local db server
/Users/samuel/dev/mongodb/bin/mongod --dbpath="/Users/samuel/dev/mongodb-data"

*/

/* CRUD https://www.mongodb.com/docs/manual/crud/
  insertOne, insertMany
  findOne, find .toArray(), countDocuments
  updateOne, updateMany
    atomic operators $set $inc -save resources by getting value and update in 1 query
  deleteOne, deleteMany
*/

/* ObjectId https://www.mongodb.com/docs/manual/reference/method/ObjectId/
  mySQL, server generates ID with the auto incrememnting integer pattern 1, 2, 3...
  MongoDB uses GUID(Global Unique Identifiers) where an algorithm generates a GUID without needing the server to assign one.
  This allows multiple servers and Improves performance - can handle higher volume of queries
*/

const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const database = "task-manager";

const id = new ObjectId();
// console.log(id.id.length);
// console.log(id.getTimestamp());
// console.log(id.toHexString().length);

const client = new MongoClient(connectionURL);

const main = async () => {
	await client.connect();
	console.log("Connected successfully to the server");
	const db = client.db(database);
};

main()
	// .then(console.log)
	.catch(console.error)
	.finally(() => client.close);
