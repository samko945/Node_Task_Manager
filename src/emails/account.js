require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail
	.send({
		to: "samkoj@hotmail.co.uk",
		from: "samkoj@hotmail.co.uk",
		subject: "This is my first creation",
		text: "I hope this gets delivered!",
	})
	.then(() => {
		console.log("Email sent!");
	})
	.catch((error) => {
		console.error(error);
	});
