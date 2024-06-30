const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require("../src/math");

test("Should calculate total with tip", () => {
	const total = calculateTip(10, 0.3);
	// if (total !== 13) throw new Error(`Total should be 13. Got ${total}`);
	expect(total).toBe(13);
});

test("Should calculate total with default tip", () => {
	const total = calculateTip(10);
	expect(total).toBe(12.5);
});

test("celsiusToFahrenheit function should convert 0 C to 32 F", () => {
	const result = celsiusToFahrenheit(0);
	expect(result).toBe(32);
});

test("fahrenheitToCelsius function should convert 32 F to 0 C", () => {
	const result = fahrenheitToCelsius(32);
	expect(result).toBe(0);
});

// Fail test example, it will pass if async isnt handled properly
// test("Async test demo", (done) => {
// 	setTimeout(() => {
// 		expect(1).toBe(2);
// 		done();
// 	}, 2000);
// });

test("Should add two numbers", (done) => {
	add(2, 3).then((result) => {
		expect(result).toBe(5);
		done();
	});
});

test("Should add two numbers async/await", async () => {
	const result = await add(10, 22);
	expect(result).toBe(32);
});
