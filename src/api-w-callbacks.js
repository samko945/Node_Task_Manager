app.post("/users", (req, res) => {
	new User(req.body)
		.save()
		.then((doc) => {
			res.status(201).send(`saved: \n${doc}`);
		})
		.catch((error) => {
			// www.webfx.com/web-development/glossary/http-status-codes
			res.status(400).send(error);
		});
});

app.get("/users", (req, res) => {
	User.find({})
		.then((doc) => {
			res.send(doc);
		})
		.catch((error) => {
			res.status(500).send();
		});
});

app.get("/users/:id", (req, res) => {
	const { id } = req.params;
	User.findById(id)
		.then((doc) => {
			if (!doc) res.status(404).send();
			res.send(doc);
		})
		.catch((error) => {
			res.status(500).send();
		});
});

app.post("/tasks", (req, res) => {
	new Task(req.body)
		.save()
		.then((doc) => {
			res.status(201).send(`saved: \n${doc}`);
		})
		.catch((error) => {
			res.status(400).send(error);
		});
});

app.get("/tasks", (req, res) => {
	Task.find({})
		.then((docs) => {
			if (!docs) res.status(404).send();
			res.send(docs);
		})
		.catch((error) => {
			res.status(500).send();
		});
});

app.get("/tasks/:id", (req, res) => {
	const { id } = req.params;
	console.log(id);
	Task.findById(id)
		.then((doc) => {
			if (!doc) {
				res.status(404).send();
			}
			res.send(doc);
		})
		.catch((error) => {
			res.status(500).send();
		});
});
