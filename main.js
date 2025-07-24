let display = document.querySelector("#display");
let btn = document.querySelectorAll(".buttons button");
let expression = "";

btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    let value = btn.innerText;

    if (value === "C") {
      expression = "";
      display.value = "";
    } else if (value === "=") {
      //   display.value = clacolator(expression);
      //   expression = display.value;
      const result = clacolator(display.value);
      if (result !== "Error") {
        addToHistory(display.value, result);
      }
      display.value = result;
    } else if (value === "√") {
      const match = display.value.match(/\(([^()]+)\)$/);

      if (match) {
        const innerExp = match[1];
        const result = clacolator(innerExp);
        if (result !== "Error") {
          const sqrtResult = Math.sqrt(Number(result));
          expression = expression.replace(/\(([^()]+)\)$/, sqrtResult);
          display.value = display.value.replace(/\(([^()]+)\)$/, sqrtResult);
          addToHistory(`√(${innerExp})`, sqrtResult);
        }
      } else {
        let lastNumber = display.value.match(/(\d+\.?\d*)$/);
        if (lastNumber) {
          const root = Math.sqrt(Number(lastNumber[0]));
          expression = expression.slice(0, -lastNumber[0].length) + root;
          display.value = display.value.slice(0, -lastNumber[0].length) + root;
          addToHistory(`√${lastNumber[0]}`, root);
        }
      }
    } else if (value === ".") {
      let lastnum = expression.match(/[\d\.]+$/);
      if (lastnum && lastnum[0].includes(".")) return;
      expression += value;
      display.value += value;
    } else if (value === "(") {
      if (/[0-9)]$/.test(expression)) {
        expression += "*(";
        display.value += "*(";
      } else {
        expression += "(";
        display.value += "(";
      }
      return;
    } else if (value === ")") {
      expression += ")";
      display.value += ")";
      return;
    } else {
      expression += value;
      display.value += value;
    }
  });
});

function clacolator(exp) {
  try {
    exp = exp.replace(/[^0-9+\-*/().]/g, "");

    while (exp.includes("(")) {
      let inner = exp.match(/\([^()]*\)/g);
      if (!inner) return "Error";
      let innerExp = inner[0].slice(1, -1);
      let innerResult = clacolator(innerExp);
      if (innerResult === "Error") return "Error";
      let before =
        exp.indexOf(inner[0]) > 0 ? exp[exp.indexOf(inner[0]) - 1] : "";
      let after = exp[exp.indexOf(inner[0]) + inner[0].length];

      if (/\d|\)/.test(before)) {
        exp = exp.replace(inner[0], "*" + innerResult);
      } else if (/\d|\(/.test(after)) {
        exp = exp.replace(inner[0], innerResult + "*");
      } else {
        exp = exp.replace(inner[0], innerResult);
      }
    }
    while (true) {
      let newExp = exp
        .replace(/(\d)(\()/g, "$1*(")
        .replace(/(\))(\d)/g, ")*$2")
        .replace(/(\))(\()/g, ")*(")
        .replace(/(\d)([a-zA-Z]+)/g, "$1*$2");
      if (newExp === exp) break;
      exp = newExp;
    }

    let token = exp.match(/(\d+(\.\d+)?)|[\+\-\*\/\(\)]/g);

    if (!token) return "Error";
    for (let i = 0; i < token.length; i++) {
      if (token[i] === "*" || token[i] === "/") {
        let left = Number(token[i - 1]);
        let right = Number(token[i + 1]);
        if (token[i] === "/" && right === 0) return "∞";
        let result = token[i] === "*" ? left * right : left / right;
        token.splice(i - 1, 3, result.toString());
        i--;
      }
    }
    let result = Number(token[0]);
    for (let i = 1; i < token.length; i += 2) {
      let oprator = token[i];
      let next = Number(token[i + 1]);
      if (oprator === "+") result += next;
      if (oprator === "-") result -= next;
    }
    return result;
  } catch (error) {
    return "Error";
  }
}

document.addEventListener("keydown", (event) => {
  let key = event.key;

  if (!isNaN(key) || "+-/*.".includes(key) || key === "(" || key === ")") {
    if (key === ".") {
      let lastnum = expression.match(/[\d\.]+$/);
      if (lastnum && lastnum[0].includes(".")) return;
    }
    if (key === "(") {
      if (/[0-9)]$/.test(expression)) {
        expression += "*(";
        display.value += "*(";
      } else {
        expression += "(";
        display.value += "(";
      }
      return;
    }
    if (key === ")") {
      expression += ")";
      display.value += ")";
      return;
    }

    expression += key;
    display.value += key;
  } else if (key === "Enter") {
    const result = clacolator(display.value);
    if (result !== "Error") {
      addToHistory(display.value, result);
    }
    display.value = result;
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
    display.value = display.value.slice(0, -1);
  } else if (key === "Escape") {
    expression = "";
    display.value = "";
  } else if (key.toLowerCase() === "s") {
      const match = display.value.match(/\(([^()]+)\)$/);

      if (match) {
        const innerExp = match[1];
        const result = clacolator(innerExp);
        if (result !== "Error") {
          const sqrtResult = Math.sqrt(Number(result));
          expression = expression.replace(/\(([^()]+)\)$/, sqrtResult);
          display.value = display.value.replace(/\(([^()]+)\)$/, sqrtResult);
          addToHistory(`√(${innerExp})`, sqrtResult);
        }
      } else {
        let lastNumber = display.value.match(/(\d+\.?\d*)$/);
        if (lastNumber) {
          const root = Math.sqrt(Number(lastNumber[0]));
          expression = expression.slice(0, -lastNumber[0].length) + root;
          display.value = display.value.slice(0, -lastNumber[0].length) + root;
          addToHistory(`√${lastNumber[0]}`, root);
        }
      }
    }
});

const toggleDarkBtn = document.getElementById("toggle-dark");
const calculator = document.querySelector(".calculator");
const body = document.body;

window.addEventListener("DOMContentLoaded", () => {
  loadhistory();
  const savedDark = localStorage.getItem("darkMode");

  if (savedDark === "true") {
    body.classList.add("dark");
    toggleDarkBtn.innerText = "Light Mode";
  }
});

toggleDarkBtn.addEventListener("click", () => {
  body.classList.toggle("dark");

  const isDark = body.classList.contains("dark");
  toggleDarkBtn.innerText = isDark ? "Light Mode" : "Dark Mode";

  localStorage.setItem("darkMode", isDark.toString());
});

function addToHistory(expression, result) {
  const historylist = document.getElementById("history-list");
  const li = document.createElement("li");
  li.textContent = `${expression}=${result}`;
  historylist.prepend(li);
  let history = JSON.parse(localStorage.getItem("calchistory")) || [];
  history.unshift({ expression, result });
  localStorage.setItem("calchistory", JSON.stringify(history));
}

function loadhistory() {
  const history = JSON.parse(localStorage.getItem("calchistory")) || [];
  const historylist = document.getElementById("history-list");
  historylist.innerHTML = "";

  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.expression} =${entry.result}`;
    historylist.appendChild(li);
  });
}

function clearhistory() {
  localStorage.removeItem("calchistory");
  document.getElementById("history-list").innerHTML = "";
}

document
  .getElementById("clear-history")
  .addEventListener("click", clearhistory);
