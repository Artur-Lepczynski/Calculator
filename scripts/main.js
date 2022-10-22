const darkModeSwitch = document.querySelector("#dark-mode-switch");
const darkModeSwitchHead = darkModeSwitch.nextElementSibling;
const lightModeStyle = document.querySelector("#link-light-style");
const darkModeStyle = document.querySelector("#link-dark-style");

darkModeSwitch.addEventListener("change", (event) => {
    //TODO: change page styling 
    if (darkModeSwitch.checked) {
        darkModeSwitchHead.style.left = "45px";
        darkModeStyle.disabled = false; 
        lightModeStyle.disabled = true; 
    } else {
        darkModeSwitchHead.style.left = "5px";
        darkModeStyle.disabled = true; 
        lightModeStyle.disabled = false; 
    };
});

const calculator = document.querySelector("#calculator-wrapper");
const calculatorButtons = document.querySelector("#calculator-buttons");
const calculatorDisplay = document.querySelector("#calculator-display-text");
const calculatorDisplayMaxLength = 14;
const calculatorSecondaryDisplay = document.querySelector("#calculator-secondary-display-text");
const calculatorSecondaryDisplayMaxLength = 25;

let operand1, operand2, result;
const errorMessage = "Error";

const modes = { none: "none", error: "error", add: "add", subtract: "subtract", multiply: "multiply", divide: "divide" };
Object.freeze(modes);
let mode = modes.none;

calculatorButtons.addEventListener("pointerdown", (event) => {
    if(event.target.matches("button, i, span")) handleClickEffect(event.target); 
    if (event.target.matches(".button-number, .button-number > span")) {
        handleNumberInput(event);
    } else if (event.target.matches(".button-operation, .button-operation > i")) {
        handleOperationInput(event);
    } else if (event.target.matches("#button-equals, #button-equals > i")) {
        handleResult(false, true);
    } else if (event.target.matches("#button-clear, #button-clear > span")) {
        handleClear();
    } else if (event.target.matches("#button-dot, #button-dot > span")) {
        handleDot();
    } else if (event.target.matches("#button-backspace, #button-backspace > i")) {
        handleBackspace();
    } else if (event.target.matches("#button-sign, #button-sign > i")) {
        handleSignChange();
    };
    handlecalculatorDisplayFontSizeChange();
});

let lastPressedTarget; 

document.addEventListener("pointerup", (event) => {
    if(lastPressedTarget){
        handleClickEffect(lastPressedTarget); 
        lastPressedTarget = null; 
    };
});

calculator.addEventListener("inputError", (event) => {
    calculator.style.borderColor = "red";
    setTimeout(() => {
        calculator.style.borderColor = "";
    }, 100);
});

function handleClickEffect(target){ 
    if(target.matches("button")) target = target.firstElementChild; 
    lastPressedTarget = target;
    target.classList.toggle("button-pressed"); 
};

function handlecalculatorDisplayFontSizeChange() {
    let length = calculatorDisplay.textContent.length;
    calculatorDisplay.style.fontSize = length > 10 ? "40px" : "48px";
};

function handleNumberInput(event) {
    let number = event.target.matches("span") ? event.target.parentElement.dataset.number : event.target.dataset.number;

    if (continued || mode === modes.error) clearAll();

    if (calculatorDisplay.textContent.length < calculatorDisplayMaxLength) {
        if (number !== "0") {
            if (calculatorDisplay.textContent === "0") calculatorDisplay.textContent = "";
            calculatorDisplay.textContent += number;
        } else {
            if (calculatorDisplay.textContent !== "0") calculatorDisplay.textContent += number;
        };
    } else {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleNumberInput" }));
    };
};

function handleOperationInput(event) {

    if (calculatorDisplay.textContent === "" && mode === modes.none || mode === modes.error) {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleOperationInput" }));
        return;
    } else if (mode === modes.none) {
        operand1 = Number.parseFloat(calculatorDisplay.textContent);
        calculatorSecondaryDisplay.textContent = operand1;
        calculatorDisplay.textContent = "";
    } else if (mode !== modes.none && calculatorDisplay.textContent !== "") {
        handleResult(true);
    };

    if (mode !== modes.error) {
        if (event.target.matches("#button-add, #button-add > i")) {
            setMode(modes.add);
        } else if (event.target.matches("#button-subtract, #button-subtract > i")) {
            setMode(modes.subtract);
        } else if (event.target.matches("#button-multiply, #button-multiply > i")) {
            setMode(modes.multiply);
        } else if (event.target.matches("#button-divide, #button-divide > i")) {
            setMode(modes.divide);
        };
    };
};

let continued = false;
function handleResult(displayOnSecondary = false, trueClick = false) {

    let temp = 0;
    let symbol;

    if (calculatorDisplay.textContent === "" || mode === modes.none || mode === modes.error) {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleResult" }));
        return;
    };

    if (displayOnSecondary && continued) {
        operand1 = Number.parseFloat(calculatorDisplay.textContent);
        calculatorSecondaryDisplay.textContent = operand1;
        calculatorDisplay.textContent = "";
        continued = false;
        return;
    };

    if (!trueClick || !continued) operand2 = Number.parseFloat(calculatorDisplay.textContent);

    switch (mode) {
        case modes.add:
            temp = (operand1 + operand2);
            symbol = " + ";
            break;
        case modes.subtract:
            temp = (operand1 - operand2);
            symbol = " - ";
            break;
        case modes.divide:
            temp = (operand1 / operand2);
            symbol = " / ";
            break;
        case modes.multiply:
            temp = (operand1 * operand2);
            symbol = " * ";
            break;
    };

    //handle large and small real numbers, + scientific notation
    if (!Number.isInteger(temp)) {
        let rounded = Math.round(temp) + "";
        result = rounded.length >= calculatorDisplayMaxLength ? Number.parseInt(rounded) : Number.parseFloat(temp.toFixed(calculatorDisplayMaxLength - (rounded.length + 1)));
        if(result.toString().includes("e-")){
            let exponent = Number.parseInt(result.toString().split("e-")[1]);
            let baseString = result.toString().split("e-")[0];
            let base =  baseString.indexOf(".") === -1 ? baseString.length : baseString.length - 1;  
            result = result.toFixed(exponent + base - 1);
        };
        if(result === 0){
            calculatorDisplay.textContent = errorMessage;
            calculatorSecondaryDisplay.textContent = "";
            setMode(modes.error);
            return;
        };
    } else {
        result = temp;
    };

    if (result === Infinity || result === -Infinity || isNaN(result) || result.toString().length > calculatorDisplayMaxLength) {
        calculatorDisplay.textContent = errorMessage;
        calculatorSecondaryDisplay.textContent = "";
        setMode(modes.error);
        return;
    };

    if (displayOnSecondary) {
        operand1 = result;
        calculatorSecondaryDisplay.textContent = result;
        calculatorDisplay.textContent = "";
    } else {
        calculatorDisplay.textContent = result;
        calculatorSecondaryDisplay.textContent = operand1 + symbol + operand2;
        operand1 = result;
        continued = true;
    };
};

const buttonDivide = document.querySelector("#button-divide"); 
const buttonMultiply = document.querySelector("#button-multiply"); 
const buttonSubtract = document.querySelector("#button-subtract"); 
const buttonAdd = document.querySelector("#button-add"); 
const operationButtons = [buttonDivide, buttonMultiply, buttonSubtract, buttonAdd];

function setMode(newMode) {
    mode = newMode;
    switch(mode){
        case modes.divide:
            applyOperationStyle(buttonDivide);
            break;
        case modes.multiply:
            applyOperationStyle(buttonMultiply);
            break;
        case modes.subtract: 
            applyOperationStyle(buttonSubtract);
            break;
        case modes.add:
            applyOperationStyle(buttonAdd);
            break;
        default: 
            applyOperationStyle(null);
    }
    
    function applyOperationStyle(button){
        operationButtons.forEach((item)=>{
            if(item === button){
                item.classList.remove("button-operation-has-hover");
                item.classList.add("button-operation-selected");
            }else{
                item.classList.remove("button-operation-selected");
                item.classList.add("button-operation-has-hover");
            };
        });  
    };

};

function handleClear() {
    if (continued) {
        clearAll();
    } else if (calculatorDisplay.textContent === "") {
        calculatorSecondaryDisplay.textContent = "";
        setMode(modes.none);
    } else {
        if (mode === modes.error) setMode(modes.none);
        if (mode === modes.none) calculatorSecondaryDisplay.textContent = "";
        calculatorDisplay.textContent = "";
    };
};

function handleDot() {
    if (mode === modes.error) {
        calculatorDisplay.textContent = "0.";
        setMode(modes.none);
    } else if (calculatorDisplay.textContent === "") {
        calculatorDisplay.textContent = "0.";
    } else if (calculatorDisplay.textContent === "0.") {
        calculatorDisplay.textContent = "";
    } else if (calculatorDisplay.textContent.endsWith(".")) {
        calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, calculatorDisplay.textContent.length - 1);
    } else if (!calculatorDisplay.textContent.split("").includes(".")) {
        calculatorDisplay.textContent += ".";
    } else {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleDot" }));
    };
};

function handleSignChange() {
    if (calculatorDisplay.textContent !== "" && mode !== modes.error) {
        if (continued) {
            calculatorSecondaryDisplay.textContent = "";
            continued = false;
            setMode(modes.none);
        };
        if (calculatorDisplay.textContent.startsWith("-")) {
            calculatorDisplay.textContent = calculatorDisplay.textContent.slice(1, calculatorDisplay.textContent.length);
        } else {
            calculatorDisplay.textContent = "-" + calculatorDisplay.textContent;
        };
    } else {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleSignChange" }));
    };
};

function handleBackspace() {
    if (mode === modes.error) {
        calculatorDisplay.textContent = "";
        setMode(modes.none);
    } else {
        if (continued) {
            continued = false;
            setMode(modes.none);
        };
        if (mode === modes.none) calculatorSecondaryDisplay.textContent = "";
        if (calculatorDisplay.textContent.startsWith("-") && calculatorDisplay.textContent.length === 2) {
            calculatorDisplay.textContent = "";
        } else {
            calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, calculatorDisplay.textContent.length - 1);
        };
    };
};

function clearAll() {
    calculatorSecondaryDisplay.textContent = "";
    calculatorDisplay.textContent = "";
    operand2 = undefined;
    continued = false;
    setMode(modes.none);
};