const darkModeSwitch = document.querySelector("#dark-mode-switch");
const darkModeSwitchHead = darkModeSwitch.nextElementSibling;

darkModeSwitch.addEventListener("change", (event) => {
    //TODO: change page styling 
    if (darkModeSwitch.checked) {
        darkModeSwitchHead.style.left = "45px";
    } else {
        darkModeSwitchHead.style.left = "5px";
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

calculatorButtons.addEventListener("click", (event) => {
    if (event.target.matches(".button-number")) {
        handleNumberInput(event);
    } else if (event.target.matches(".button-operation")) {
        handleOperationInput(event);
    } else if (event.target.matches("#button-equals")) {
        handleResult();
    } else if (event.target.matches("#button-clear")) {
        handleClear();
    } else if (event.target.matches("#button-dot")) {
        handleDot();
    } else if (event.target.matches("#button-backspace")) {
        handleBackspace();
    } else if (event.target.matches("#button-sign")) {
        handleSignChange();
    };
});

calculator.addEventListener("inputError", (event) => {
    console.log("caught error:", event.detail);
    calculator.style.borderColor = "red";
    setTimeout(() => {
        calculator.style.borderColor = "";
    }, 100);
});

function handleNumberInput(event) {
    let number = event.target.dataset.number; 

    if (mode === modes.error) {
        calculatorDisplay.textContent = "";
        calculatorDisplay.textContent += number;
        setMode(modes.none);
        return;
    };

    if (calculatorDisplay.textContent.length < calculatorDisplayMaxLength) {
        if (event.target.textContent !== "0") {
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
        if (event.target.matches("#button-add")) {
            setMode(modes.add);
        } else if (event.target.matches("#button-subtract")) {
            setMode(modes.subtract);
        } else if (event.target.matches("#button-multiply")) {
            setMode(modes.multiply);
        } else if (event.target.matches("#button-divide")) {
            setMode(modes.divide);
        };
    }
};

function handleResult(displayOnSecondary = false) {

    if (calculatorDisplay.textContent === "" || mode === modes.none || mode === modes.error) return;
    operand2 = Number.parseFloat(calculatorDisplay.textContent);
    let temp = 0; 

    switch (mode) {
        case modes.add:
            // result = Number.parseFloat(temp.toFixed(calculatorDisplayMaxLength - ((""+Math.round(temp)).length+1)));
            // result = Number.parseFloat((operand1 * operand2).toFixed(calculatorDisplayMaxLength));
            temp = (operand1 + operand2);
            break;
        case modes.subtract:
            temp = (operand1 - operand2);
            break;
        case modes.divide:
            temp = (operand1 / operand2);
            break;
        case modes.multiply:
            temp = (operand1 * operand2);
            break;
    };

    if(!Number.isInteger(temp)){
        result = Number.parseFloat(temp.toFixed(calculatorDisplayMaxLength - ((""+Math.round(temp)).length+1)));
    }else{
        result = temp; 
    };

    if (result === Infinity || result === -Infinity || isNaN(result) || result.toString().length > calculatorDisplayMaxLength) {
        calculatorDisplay.textContent = errorMessage;
        calculatorSecondaryDisplay.textContent = "";
        setMode(modes.error);
        return;
    };

    if (displayOnSecondary) {
        calculatorSecondaryDisplay.textContent = result;
        calculatorDisplay.textContent = "";
    } else {
        calculatorDisplay.textContent = result;
        calculatorSecondaryDisplay.textContent = "";
        setMode(modes.none);
    };
};

function setMode(newMode) {
    //TODO: add and remove styling
    mode = newMode;
    console.log("set mode:", mode);
};

function handleClear() {
    if (calculatorDisplay.textContent === "") {
        calculatorSecondaryDisplay.textContent = "";
        setMode(modes.none);
    } else {
        if(mode === modes.error) setMode(modes.none); 
        calculatorDisplay.textContent = "";
    }
};

function handleDot() {
    if(mode === modes.error){
        calculatorDisplay.textContent = "0.";
        setMode(modes.none);
    } else if (calculatorDisplay.textContent === "") {
        calculatorDisplay.textContent = "0.";
    } else if (calculatorDisplay.textContent === "0.") {
        calculatorDisplay.textContent = "";
    } else if (calculatorDisplay.textContent.endsWith(".")) {
        calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, calculatorDisplay.textContent.length - 1);
    } else if (!calculatorDisplay.textContent.endsWith(".") && !calculatorDisplay.textContent.split("").includes(".")) {
        calculatorDisplay.textContent += ".";
    };
}

function handleSignChange() {
    if (calculatorDisplay.textContent !== "" && mode !== modes.error) {
        if (calculatorDisplay.textContent.startsWith("-")) {
            calculatorDisplay.textContent = calculatorDisplay.textContent.slice(1, calculatorDisplay.textContent.length);
        } else {
            calculatorDisplay.textContent = "-" + calculatorDisplay.textContent;
        };
    }else{
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleSignChange" }));
    };
};

function handleBackspace() {
    if (mode === modes.error) {
        calculatorDisplay.textContent = "";
        setMode(modes.none);
    } else {
        if (calculatorDisplay.textContent.startsWith("-") && calculatorDisplay.textContent.length === 2) {
            calculatorDisplay.textContent = "";
        } else {
            calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, calculatorDisplay.textContent.length - 1);
        };
    };
};



































































































