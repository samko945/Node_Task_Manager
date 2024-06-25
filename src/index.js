const express = require("express");
// connect to db via mongoose
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

// const multer = require("multer");
// const upload = multer({
// 	dest: "images",
// 	limits: {
// 		fileSize: 1000000,
// 	},
// 	fileFilter(req, file, cb) {
// 		// if (!file.originalname.endsWith(".pdf")) {
// 		if (!file.originalname.match(/\.(doc|docx)$/)) {
// 			return cb(new Error("Please upload a Word document"));
// 		}

// 		cb(undefined, true);

// 		// // error
// 		// cb(new Error("File must be a PDF."));
// 		// // no error, accept file
// 		// cb(undefined, true);
// 		// // no error, reject file
// 		// cb(undefined, false);
// 	},
// });

// // example of an error occuring in a middleware and then being handled in the error handling middleware
// const errorMiddleware = (req, res, next) => {
// 	throw new Error("From my middleware");
// };

// // the file key name in the request body needs to match the string in upload.single()
// app.post(
// 	"/upload",
// 	errorMiddleware,
// 	(req, res) => {
// 		res.send();
// 	},
// 	// Error handling middleware
// 	(error, req, res, next) => {
// 		res.status(400).send({ error: error.message });
// 	}
// );

/*
Each app.use(middleware) is called every time a request is sent to the server
Order matters. i.e. Each middleware function is executed in the order in which it is defined - you need to execute one before the other in order to utilise its functionality. 

  function(req, res, next){}
    In a middleware function, invoke the third argument i.e. next() to allow the request to be passed on to the subsequent item in the middleware stack(if there are more middleware functions) or the route handler if this was the last middleware function.

*/

// app.use((req, res, next) => {
// 	console.log("Method: ", req.method, "Path: ", req.path);
// 	if (req.method === "GET") {
// 		res.send("GET requests are disabled.");
// 	} else {
// 		next();
// 	}
// });

// app.use((req, res, next) => {
// 	res.status(503).send("Maintenance in session. Please try again later.");
// });

// app.use((req, res, next) => {});

/*
Declare express.json middleware before than any route handlers, because that middleware is in charge of parsing the information of the request and put into the request body property, after that it automatically call next to continue the execution flow
*/

// Automatically parse incoming JSON to an object
app.use(express.json());

// Route handlers
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log("server is running on port " + port);
});

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
	// const task = await Task.findById("65a069c25171d4a7a8fcc4c3");
	// console.log(task);
	// // populate fills in related data that was being referenced using the ref in the Model
	// await task.populate("owner");
	// console.log(task);
	//
	// const user = await User.findById("65a0682e90e8ee87e65ad22d");
	// // console.log(user);
	// await user.populate("tasks");
	// console.log(user.tasks);
};
main();
