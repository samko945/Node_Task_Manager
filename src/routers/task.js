const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
	try {
		const newTask = await new Task({ ...req.body, owner: req.user._id }).save();
		res.status(201).send({ saved: newTask });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/tasks", auth, async (req, res) => {
	const match = {};
	const sort = {};
	if (req.query.completed) {
		match.completed = req.query.completed === "true";
	}
	if (req.query.sortBy) {
		// in the query ":" is between key/value pairs
		const parts = req.query.sortBy.split(":");
		// use [0] and [1] to access each part and convert asc or desc into 1 or -1
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
		console.log(parts[0], parts[1]);
	}
	try {
		// const tasks = await Task.find({ owner: req.user._id });
		await req.user.populate({
			path: "tasks",
			// match: {
			// 	completed: false,
			// },
			match,
			options: {
				// first page of 2 is {limit:2, skip:0}, second page of 2 is {limit:2, skip:2}
				// how many results to get
				limit: parseInt(req.query.limit),
				// how many results to skip
				skip: parseInt(req.query.skip),
				// sort: {
				// 	// 1 is ascending, -1 is descending
				// 	createdAt: -1,
				// },
				sort,
			},
		});

		// res.send(tasks);
		res.send(req.user.tasks);
	} catch (e) {
		console.error(e);
		res.status(500).send();
	}
});

router.get("/tasks/:id", auth, async (req, res) => {
	const { id } = req.params;
	try {
		// const task = await Task.findById(id);
		const task = await Task.findOne({ _id: id, owner: req.user._id });
		if (!task) {
			res.status(404).send();
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

router.patch("/tasks/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const newData = req.body;
		const allowUpdates = ["description", "completed"];
		const updateFields = Object.keys(newData);
		const isValidUpdate = updateFields.every((property) => allowUpdates.includes(property));
		if (!isValidUpdate) {
			return res.status(400).send({ error: "Invalid properties!" });
		}
		const task = await Task.findOne({ _id: id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}

		updateFields.forEach((key) => (task[key] = newData[key]));
		task.save();

		res.send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete("/tasks/:id", auth, async (req, res) => {
	const { id } = req.params;
	try {
		const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
		if (!task) {
			return res.status(404).send();
		}
		res.send({ "Deleted:": task });
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
