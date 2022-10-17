const darkModeSwitch = document.querySelector("#dark-mode-switch");
const darkModeSwitchHead = darkModeSwitch.nextElementSibling;
// darkModeSwitch.checked = false; 

darkModeSwitch.addEventListener("change", (event) => {
    console.log("switched:", darkModeSwitch.checked);
    if (darkModeSwitch.checked) {
        darkModeSwitchHead.style.left = "45px";
    } else {
        darkModeSwitchHead.style.left = "5px";
    }
});

const calculator = document.querySelector("#calculator-wrapper");
const calculatorButtons = document.querySelector("#calculator-buttons");
const calculatorDisplay = document.querySelector("#calculator-display-text");
const calculatorDisplayMaxLength = 16;
const calculatorSecondaryDisplay = document.querySelector("#calculator-secondary-display-text");
const calculatorSecondaryDisplayMaxLength = 25;

let operand1;
let operand2;
let result = "";
const errorMessage = "Error";

//add error mode!!!!!!!!!
const modes = { none: "none", add: "add", subtract: "subtract", multiply: "multiply", divide: "divide" };
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
        calculatorDisplay.textContent === "" ? clearAll() : calculatorDisplay.textContent = "";
    } else if (event.target.matches("#button-dot")) {
        handleDot();
    } else if (event.target.matches("#button-backspace")) {
        handleBackspace();
    } else if (event.target.matches("#button-sign")) {
        handleSignChange();
    }
});

calculator.addEventListener("inputError", (event) => {
    console.log("caught error:", event.detail);
    calculator.style.borderColor = "red";
    setTimeout(() => {
        calculator.style.borderColor = "";
    }, 100);
});

function handleNumberInput(event) {
    if (calculatorDisplay.textContent.length < calculatorDisplayMaxLength) {
        if (calculatorDisplay.textContent !== errorMessage) {
            if (event.target.textContent !== "0") {
                if (calculatorDisplay.textContent === "0") {
                    calculatorDisplay.textContent = "";
                }
                calculatorDisplay.textContent += event.target.textContent;
            } else {
                if (calculatorDisplay.textContent !== "0") {
                    calculatorDisplay.textContent += event.target.textContent;
                }
            }
        }else{
            calculatorDisplay.textContent = "";
            calculatorDisplay.textContent += event.target.textContent;
        }
    } else {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleNumberInput" }));
    }
};

function handleOperationInput(event) {
    // console.log("handle operation, mode:", mode); 

    if ((calculatorDisplay.textContent === "" && mode === modes.none) || (calculatorDisplay.textContent === errorMessage && mode === modes.none)) {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleOperationInput" }));
        return;
    } else if (mode === modes.none) {
        operand1 = Number.parseFloat(calculatorDisplay.textContent);
        calculatorSecondaryDisplay.textContent = operand1;
        calculatorDisplay.textContent = "";
    } else if (mode !== modes.none && calculatorDisplay.textContent !== "") {
        operand1 = handleResult(true);
    };

    if (operand1 !== errorMessage) {
        //TODO: add classes to highlight buttons
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

    // console.log("oper1:", operand1, "mode:", mode);
};

function handleResult(displayOnSecondary = false) {

    if (calculatorDisplay.textContent === "" || mode === modes.none) {
        calculator.dispatchEvent(new CustomEvent("inputError", { detail: "handleResult" }));
        return;
    }
    operand2 = Number.parseFloat(calculatorDisplay.textContent);
    // console.log("handle result, oper1:", operand1, "oper2:", operand2);

    //TODO: remove classes to highlight buttons
    switch (mode) {
        case modes.add:
            result = Number.parseFloat((operand1 + operand2).toFixed(calculatorDisplayMaxLength));
            break;
        case modes.subtract:
            result = Number.parseFloat((operand1 - operand2).toFixed(calculatorDisplayMaxLength));
            break;
        case modes.divide:
            result = Number.parseFloat((operand1 / operand2).toFixed(calculatorDisplayMaxLength));
            break;
        case modes.multiply:
            result = Number.parseFloat((operand1 * operand2).toFixed(calculatorDisplayMaxLength));
            break;
    };


    console.log("RESULT:", result);

    if (result === Infinity || result === -Infinity || isNaN(result) || result.toString().length > calculatorDisplayMaxLength) {
        setMode(modes.none);
        calculatorDisplay.textContent = errorMessage;
        calculatorSecondaryDisplay.textContent = "";
        return errorMessage;
    };

    if (displayOnSecondary) {
        calculatorSecondaryDisplay.textContent = result;
        calculatorDisplay.textContent = "";
        return result;
    } else {
        calculatorDisplay.textContent = result;
        calculatorSecondaryDisplay.textContent = "";
        setMode(modes.none);
    }

};

function setMode(newMode) {
    //remove styling
    mode = newMode;
    console.log("set mode:", mode);
}

function clearAll() {
    //TODO: remove style from operation buttons
    calculatorSecondaryDisplay.textContent = "";
    setMode(modes.none);
};

function handleDot() {
    if (calculatorDisplay.textContent === "") {
        calculatorDisplay.textContent = "0."
    } else if (calculatorDisplay.textContent.endsWith("0.")) {
        calculatorDisplay.textContent = "";
    } else if (calculatorDisplay.textContent.endsWith(".")) {
        calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, calculatorDisplay.textContent.length - 1);
    } else if (!calculatorDisplay.textContent.endsWith(".") && !calculatorDisplay.textContent.split("").includes(".")) {
        calculatorDisplay.textContent += "."
    };
};

function handleSignChange() {
    if (calculatorDisplay.textContent !== "") {
        if (calculatorDisplay.textContent.startsWith("-")) {
            calculatorDisplay.textContent = calculatorDisplay.textContent.slice(1, calculatorDisplay.textContent.length);
        } else {
            calculatorDisplay.textContent = "-" + calculatorDisplay.textContent;
        };
    };
};

function handleBackspace() {
    if(calculatorDisplay.textContent === errorMessage){
        calculatorDisplay.textContent = "";
    }else {
        if (calculatorDisplay.textContent.startsWith("-") && calculatorDisplay.textContent.length === 2) {
            calculatorDisplay.textContent = "";
        } else {
            calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, calculatorDisplay.textContent.length - 1);
        };
    }
};



































































































