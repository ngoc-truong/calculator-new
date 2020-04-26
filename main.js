// Functions

function add(num1, num2) {
    return Number(num1) + Number(num2);
}

function substract(num1, num2) {
    return Number(num1) - Number(num2);
}

function multiply(num1, num2) {
    return Number(num1) * Number(num2);
}

function divide(num1, num2) {
    if (num2 === 0) {
        return "Ah ah ah, you cannot divide by 0 :)."
    }
    return Number(num1) / Number(num2);
}

function operate(operator, num1, num2) {
    switch(operator){
        case "+":
            return add(num1, num2);
            break;
        case "-":
            return substract(num1, num2);
            break;
        case "×":
            return multiply(num1, num2);
            break;
        case "÷":
            return divide(num1, num2);
            break;
        default:  
    }
}

function calculateTwoOperators(array, operator1, operator2) {
    let index;
    let result; 

    while (array.includes(operator1) || array.includes(operator2)){
        index = array.findIndex( (element) =>  element === operator1 || element === operator2);
        result = operate(array[index], array[index - 1], array[index + 1]);
        array[index - 1] = result;
        array.splice(index, 2);
    }
    console.log(array);
    return array;
};

function calculate(array){
    // Math precedence
    array = calculateTwoOperators(array, "×", "÷");
    array = calculateTwoOperators(array, "+", "-");
    return array;
}

// Bug fix functions
function resetAfterOperatorClicked(){
    // Fix bug that an operator appears infront of numbers like "*31" in display
    if (display.textContent.includes("+") ||
        display.textContent.includes("-") ||
        display.textContent.includes("÷") ||
        display.textContent.includes("×")) {
            display.textContent = "";
    }
}

function resetAfterEqualsClicked(){
    // Fix bug that user can add numbers to a result
    if (equalsPressed === true) {
        display.textContent = "";
        equalsPressed = false;
    }
}

function disableDecimal(){
    // Disable decimal point if it is already used
    if (display.textContent.includes(".")) {
        decimal.disabled = true;
    }
}

function disallowZerosFirst(key){
    if (display.textContent === "0" && key.textContent !== "."){
        display.textContent = "";
    }
}

function trimInputsArray(){
    // If first element in inputs is an operator, delete it.
    if (inputs[0] === "+" ||
        inputs[0] === "-" ||
        inputs[0] === "÷" ||
        inputs[0] === "×") {
            inputs.shift();
    }

    // If last element in inputs array is an operator, delete it.
    if (!isNaN(display.textContent)){
        inputs.push(Number(display.textContent));
    } else {
        inputs.pop();
    }
}

// DOM-Elements

const numbers       = document.querySelectorAll(".number");
const operators     = document.querySelectorAll(".operator");
const display       = document.querySelector("#display");
const equals        = document.querySelector("#equals");
const decimal       = document.querySelector(".decimal");
const reset         = document.querySelector("#reset");
const deleteLast    = document.querySelector("#delete-last");
const sign          = document.querySelector("#algebraic-sign");

let inputs = [];
let equalsPressed = false;

// User interactions

// User types in numbers
numbers.forEach( (number) => {
    number.addEventListener("click", (e) => {
        resetAfterOperatorClicked();
        resetAfterEqualsClicked();
        disableDecimal();
        disallowZerosFirst(number);

        // Populate display
        display.textContent += number.textContent;
    })
})

// User types in operators
operators.forEach( (operator) => {
    operator.addEventListener("click", (e) => {
        decimal.disabled = false;

        // Add the current number on display to input 
        if (display.textContent !== ""){
            inputs.push(Number(display.textContent));               
        }

        display.textContent = operator.textContent;

        // If last element in inputs is an operator.
        // replace it with current operator.
        let last = inputs[inputs.length - 1];

        if (last === "+" ||
            last === "-" ||
            last === "÷" ||
            last === "×"){
                inputs[inputs.length - 2] = operator.textContent;
                inputs.pop();
        } else {
            inputs.push(operator.textContent);
        }
    })
})

// User clicks equals and wants to calculate
equals.addEventListener("click", (e) => {
    decimal.disabled = false;
    equalsPressed = true;
    trimInputsArray();
    result = calculate(inputs);

    if (typeof(result) === "number") {
        display.textContent = Math.round(result * 100) / 100;
    } else {
        display.textContent = result;
    }

    // Reset after all calculations
    inputs = [];
})

reset.addEventListener("click", (e) => {
    decimal.disabled = false;
    inputs = [];
    display.textContent = "";
})

deleteLast.addEventListener("click", (e) => {
    display.textContent = display.textContent.slice(0, -1);
})

sign.addEventListener("click", (e) => {
    if (display.textContent[0] === "-"){
        display.textContent = display.textContent.substring(1, display.textContent.length);
    } else {
        display.textContent = "-" + display.textContent;
    }
})



/*
 Bugs:
- User should not be allowed to type in decimal without a number
- Users should not be allowed to divide through zero


Fixed:
- When user starts with an operator it will put in an empty string
- No clear button
- User is not allowed to type in -6 (with the operator)
- Precedence between + and - does not work correctly since 6 - 6 + 3 != -3;
- After result is shown and user types in numbers, numbers will be added to the result (instead of new)
- When user starts with a decimal number, it will not put it into inputs array
- User should not be allowed to write 030
- Instead of / and * use special arithmetic symbols
- No delete last number button 
*/