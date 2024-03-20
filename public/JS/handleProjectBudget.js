const addProjectBudgetButton = document.getElementById("add-budget-btn");
const newProjectBudgetContainer = document.getElementById("new-projectbudget-container");
const inputProjectBudgetElement = document.getElementById("projectbudget-input");

const addTransactionButton = document.getElementById("add-transaction-btn");
const newTransactionContainer = document.getElementById("new-transaction-container");
const inputProjectTransactionDate = document.getElementById("projectTransactionDate");
const inputProjectTransactionDescription = document.getElementById("projectTransactionDescription");
const inputProjectTransactionAmount = document.getElementById("projectTransactionAmount");
const inputProjectTransactionType = document.querySelector(".radio-input");

const editProjectBudgetButton = document.getElementById("edit-budget-btn");
const editProjectBudgetContainer = document.getElementById("edit-projectbudget-container");
const inputNewProjectBudgetElement = document.getElementById("edit-projectbudget-input");

const currentDate = new Date().toISOString().split("T")[0];


// EVENT LISTENER TO ADD A NEW PROJECT BUDGET
if (addProjectBudgetButton) {
  addProjectBudgetButton.addEventListener("click", () => {
    newProjectBudgetContainer.style.display = "block";
    inputProjectBudgetElement.focus();
  });
};

// EVENT LISTENER TO ADD A NEW TRANSACTION
if (addTransactionButton) {
addTransactionButton.addEventListener("click", () => {
  newTransactionContainer.style.display = "block";
  inputProjectTransactionType.focus();
  inputProjectTransactionDate.value = currentDate;
});
};

// EVENT LISTENER TO EDIT PROJECT BUDGET
if (editProjectBudgetButton) {
  editProjectBudgetButton.addEventListener("click", () => {
    editProjectBudgetContainer.style.display = "block";
    inputNewProjectBudgetElement.focus();
  });
};


// CLOSE TRANSACTION FORM //
function closeTransactionForm() {
  newTransactionContainer.style.display = "none";
};

// CLOSE BUDGET FORM //
function closeBudgetForm() {
  newProjectBudgetContainer.style.display = "none";
};

