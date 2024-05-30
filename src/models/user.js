const mongoose = require("mongoose");
/* validator
https://www.npmjs.com/package/validator
*/
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid.");
			}
		},
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Do not include the word 'password' in your password");
			}
		},
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error("Age must be a positive number.");
			}
		},
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});

/** 
  https://mongoosejs.com/docs/tutorials/virtuals.html
  The ref option, which tells Mongoose which model to populate documents from.
  The localField and foreignField options. Mongoose will populate documents from the model in ref whose foreignField matches this document's localField.
 */
userSchema.virtual("tasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

// Instance methods are accessible on the instances
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, "thistaskmanagerproject");
	// user.tokens is a sub-document, each token in the array will also get an _id property
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

/* toJSON functions on objects
JavaScript supports custom toJSON() functions on objects. When serializing an object, JavaScript looks for a toJSON() property on that specific object. If the toJSON() property is a function, then that method customizes the JSON serialization behavior.

In JavaScript, the JSON.stringify() function looks for functions named toJSON in the object being serialized. If an object has a toJSON function, JSON.stringify() calls toJSON() and serializes the return value from toJSON() instead.
*/
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	// The delete operator removes a property from an object.
	delete userObject.password;
	delete userObject.tokens;
	return userObject;
};

// Static/Model methods are accessible on the model i.e User
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		throw new Error("Unable to log in.");
	}
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Unable to log in.");
	}
	return user;
};

/*  
  Middleware

  schema.pre("event", callback(next) {
    do something before an event
  })
  schema.post("event", callback(next) {
    do something after an event
  })
*/

/* Hash plain text password before saving
  It's more effecient to have this here once instead of both in the POST and UPDATE routes of user
*/
userSchema.pre("save", async function (next) {
	console.log("Just before saving");
	const user = this;
	if (user.isModified("password")) {
		// Hashing algorithms are one-way, they cannot be converted back. Unlike encyption which is reversable
		const hashedPassword = await bcrypt.hash(user.password, (salt = 8));
		user.password = hashedPassword;
	}

	next();
});

// Delete user's tasks when user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
	const user = this;
	const deletedTasks = await Task.deleteMany({ owner: user._id });
	console.log("Delete Tasks: ", deletedTasks);
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
