require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail
		.send({
			to: email,
			from: "samkoj@hotmail.co.uk",
			subject: "Thanks for joining in!",
			text: `Welcoem to app, ${name}. Let me know how you get along with the app.`,
		})
		.then(() => {
			console.log(`Sent welcome email to ${email}`);
		})
		.catch((error) => {
			console.error(error);
		});
};

module.exports = {
	sendWelcomeEmail,
};
