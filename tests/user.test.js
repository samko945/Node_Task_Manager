const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: "Bob",
	email: "bob@gmail.com",
	password: "bob12345",
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
		},
	],
};

beforeEach(async () => {
	// clear the users in database
	await User.deleteMany();
	await new User(userOne).save();
});

test("Should signup a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Sam",
			email: "samjavorka@gmail.com",
			password: "sam12345",
		})
		.expect(201);

	// Assert that the database was changed correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// Assertions about the response
	// toMatchObject makes sure that it contains the key/values listed, the obj can contain unmentioned data
	expect(response.body).toMatchObject({
		user: {
			name: "Sam",
			email: "samjavorka@gmail.com",
		},
		token: user.tokens[0].token,
	});
	// Assert that the password is not stored in plain text
	expect(user.password).not.toBe("sam12345");
});

test("Should login existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: userOne.email,
			password: userOne.password,
		})
		.expect(200);

	const user = await User.findById(response.body.user._id);
	// Validate that new token is saved
	expect(response.body.token).toBe(user.tokens[1].token);
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

test("Should get profile for user", async () => {
	await request(app).get("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
	await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
	const response = await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	// Validate that the user has been removed from the database
	const user = await User.findById(response.body.Removed.user._id);
	expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
	await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/profile-pic.jpg")
		.expect(200);
	const user = await User.findById(userOneId);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ name: "Tobi" })
		.expect(200);

	const user = await User.findById(userOne.userOneId);
	console.log(user);
});
