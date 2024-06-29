const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } = require("../src/math");

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
