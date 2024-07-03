const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { userOneId, userOne, userTwo, taskOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
	const response = await request(app)
		.post("/tasks")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: "From my test",
		})
		.expect(201);
	const task = await Task.findById(response.body.saved._id);
	expect(task).not.toBeNull();
	expect(task.completed).toEqual(false);
});

test("Should get all tasks for a user", async () => {
	const response = await request(app)
		.get("/tasks")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	expect(response.body.length).toBe(2);
});

test("Should not delete other users tasks", async () => {
	// Attempt userTwo to delete taskOne that belongs to userOne
	const response = await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);
	const task = await Task.findById(taskOne._id);
	expect(task).not.toBeNull();
});

test("Should fetch only incomplete tasks", async () => {
	const response = await request(app)
		.get("/tasks?completed=false")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	expect(response.body.every((task) => task.complete === false)).toBe(false);
});

/*
 Task Test Ideas
 - Should not create task with invalid description / completed
 - Should not update task with invalid description / completed
 - Should delete user task
 - Should not delete task if unauthenticated
 - Should sort tasks by description / completed / createdAt / updatedAt
 - Should fetch page of tasks
*/
