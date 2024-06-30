const request = require("supertest");
const app = require("../src/app");

test("Should signup a new user", async () => {
	await request(app)
		.post("/users")
		.send({
			name: "Sam",
			email: "samjavorka@gmail.com",
			password: "sam12345",
		})
		.expect(201);
});
