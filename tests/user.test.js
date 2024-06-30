const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
	name: "Bob",
	email: "bob@gmail.com",
	password: "bob12345",
};

beforeEach(async () => {
	// clear the users in database
	await User.deleteMany();
	await new User(userOne).save();
});

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

test("Should login existing user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200);
});

test("Should not login nonexistent user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: "wrongEmail@yoyo.com",
			password: "21dsa32",
		})
		.expect(400);
});
