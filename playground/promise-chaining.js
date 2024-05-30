require("../src/db/mongoose");
const User = require("../src/models/user");
const Task = require("../src/models/task");

// User.findByIdAndUpdate("65904f99f349c2fb709f19d6", { age: 1 })
// 	.then((doc) => {
// 		console.log(doc);
// 		return User.countDocuments({ age: 1 });
// 	})
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// const updateAgeAndCount = async (id, age) => {
// 	const user = await User.findByIdAndUpdate(id, { age });
// 	// console.log(user);
// 	const count = await User.countDocuments({ age });
// 	return count;
// };

// updateAgeAndCount("65904f99f349c2fb709f19d6", 25)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

// new Task({ description: "delete this one" }).save().then((doc) => {
// 	console.log(doc);
// });

// Task.findByIdAndDelete("659199a2199e792b388df954")
// 	.then((doc) => {
// 		console.log("Deleted: ", doc);
// 		return Task.countDocuments({ completed: false });
// 	})
// 	.then((result) => {
// 		console.log("Incomplete tasks: ", result);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

const deleteTaskAndCount = async (id) => {
	await Task.findByIdAndDelete(id);
	const count = await Task.countDocuments({ completed: false });
	return count;
};

deleteTaskAndCount("6591c45760372d6c6fb23154")
	.then((count) => {
		console.log(count);
	})
	.catch((error) => {
		console.log(error);
	});
