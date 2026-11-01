const currentOperandElement = document.getElementById("currentOperand");
const previousOperandElement = document.getElementById("previousOperand");
const calculatorButtons = document.querySelector(".calculator-buttons");

let currentOperand = "0";
let previousOperand = "";
let selectedOperator = null;
let shouldResetScreen = false;

// Update the calculator display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;

    if (selectedOperator && previousOperand !== "") {
        previousOperandElement.textContent =
            `${previousOperand} ${getOperatorSymbol(selectedOperator)}`;
    } else {
        previousOperandElement.textContent = "";
    }
}

// Display the correct mathematical symbol
function getOperatorSymbol(operator) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator];
}

// Add a number or decimal point
function appendNumber(number) {
    if (currentOperand === "Error") {
        clearCalculator();
    }

    if (number === "." && currentOperand.includes(".")) {
        return;
    }

    if (shouldResetScreen) {
        currentOperand = number === "." ? "0." : number;
        shouldResetScreen = false;
    } else if (number === "." && currentOperand === "0") {
        currentOperand = "0.";
    } else if (currentOperand === "0" && number !== ".") {
        currentOperand = number;
    } else {
        currentOperand += number;
    }

    updateDisplay();
}

// Select a mathematical operator
function chooseOperator(operator) {
    if (currentOperand === "Error") {
        return;
    }

    if (selectedOperator && !shouldResetScreen) {
        calculate();
    }

    previousOperand = currentOperand;
    selectedOperator = operator;
    shouldResetScreen = true;

    updateDisplay();
}

// Perform the calculation
function calculate() {
    if (!selectedOperator || previousOperand === "") {
        return;
    }

    const firstNumber = Number(previousOperand);
    const secondNumber = Number(currentOperand);

    let result;

    switch (selectedOperator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                showError();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    if (!Number.isFinite(result)) {
        showError();
        return;
    }

    currentOperand = String(Number(result.toPrecision(12)));
    previousOperand = "";
    selectedOperator = null;
    shouldResetScreen = true;

    updateDisplay();
}

// Handle invalid calculations
function showError() {
    currentOperand = "Error";
    previousOperand = "";
    selectedOperator = null;
    shouldResetScreen = true;

    updateDisplay();
}

// Clear everything
function clearCalculator() {
    currentOperand = "0";
    previousOperand = "";
    selectedOperator = null;
    shouldResetScreen = false;

    updateDisplay();
}

// Delete the last entered character
function deleteNumber() {
    if (currentOperand === "Error") {
        clearCalculator();
        return;
    }

    if (shouldResetScreen) {
        return;
    }

    currentOperand = currentOperand.length > 1
        ? currentOperand.slice(0, -1)
        : "0";

    if (currentOperand === "-") {
        currentOperand = "0";
    }

    updateDisplay();
}

// Handle calculator button clicks
calculatorButtons.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    }

    if (button.dataset.action === "calculate") {
        calculate();
    }

    if (button.dataset.action === "clear") {
        clearCalculator();
    }

    if (button.dataset.action === "delete") {
        deleteNumber();
    }
});

// Support keyboard input
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        appendNumber(key);
    } else if (key === ".") {
        appendNumber(".");
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteNumber();
    } else if (key === "Escape") {
        clearCalculator();
    }
});

// Initialize the display
updateDisplay();