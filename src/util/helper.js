const validNumber = (...inputs) => inputs.every((i) => Number.isFinite(i));
const allPositive = (...inputs) => inputs.every((i) => i > 0);

export { validNumber, allPositive };
