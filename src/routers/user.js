const express = require("express");
const multer = require("multer");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/users", async (req, res) => {
	try {
		const user = await new User(req.body).save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		console.log(error);
		res.status(400).send(error);
		// www.webfx.com/web-development/glossary/http-status-codes
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(({ token }) => {
			return token !== req.token;
		});

		await req.user.save();
		res.send("Logged out!");
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

router.post("/users/logout-all", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		req.user.save();
		res.send({ "Logged out all sessions for ": req.user.email });
	} catch (e) {
		console.log(e);
		res.status(500).send();
	}
});

// router.get("/users", auth, async (req, res) => {
// 	try {
// 		console.log("Logged in as: ", req.user.name);
// 		const users = await User.find({});
// 		res.send(users);
// 	} catch (error) {
// 		res.status(500).send();
// 	}
// });

router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		res.send(user);
	} catch (error) {
		res.status(500).send();
	}
});

router.patch("/users/me", auth, async (req, res) => {
	const newData = req.body;
	// Compare and allow only permitted data object's property keys
	const allowUpdates = ["name", "email", "password", "age"];
	const updateFields = Object.keys(newData);
	const isValidUpdate = updateFields.every((property) => allowUpdates.includes(property));
	if (!isValidUpdate) {
		return res.status(400).send({ error: "Invalid properties!" });
	}
	try {
		/* Options
      new:true = return the user with the update applied
      runValidators:true
    */
		// const user = await User.findByIdAndUpdate(id, newData, { new: true, runValidators: true });
		const { user } = req;

		updateFields.forEach((field) => {
			user[field] = newData[field];
		});

		// Save user
		// Middleware on save event gets executed
		await user.save();

		res.send(user);
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		const id = req.user._id;
		const user = await User.findOne(id);
		// const result = await userDelete.deleteOne();
		const removed = await user.deleteOne();
		console.log("Removed User: ", removed);

		res.send({ Removed: { user: req.user } });
	} catch (e) {
		console.log(e);
		res.status(400).send(e);
	}
});

const upload = multer({
	dest: "avatar",
	limits: { fileSize: 1_000_000 },
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
			cb(new Error("File needs to be a jpeg, jpg or png"));
		}
		cb(undefined, true);
	},
});

// the file key name in the request body needs to match the string in upload.single()
router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
	res.send();
});

module.exports = router;
