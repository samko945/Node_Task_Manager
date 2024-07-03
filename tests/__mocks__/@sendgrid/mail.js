// https://jestjs.io/docs/manual-mocks

module.exports = {
	setApiKey() {},
	send() {
		return Promise.resolve();
	},
};
