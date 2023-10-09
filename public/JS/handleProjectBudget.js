const addProjectBudgetButton = document.getElementById("add-budget-btn");
const newProjectBudgetContainer = document.getElementById("new-projectbudget-container");
const inputProjectBudgetElement = document.getElementById("projectbudget-input");
const addExpenseButton = document.getElementById("add-expense-btn");
const newExpenseContainer = document.getElementById("new-expense-container");
const inputProjectExpenseDate = document.getElementById("projectExpenseDate");
const inputProjectExpenseDescription = document.getElementById("projectExpenseDescription");
const inputProjectExpenseAmount = document.getElementById("projectExpenseAmount");


// EVENT LISTENER TO ADD A NEW PROJECT BUDGET
if (addProjectBudgetButton) {
  addProjectBudgetButton.addEventListener("click", () => {
    newProjectBudgetContainer.style.display = "block";
    inputProjectBudgetElement.focus();
  });
};

// EVENT LISTENER TO ADD A NEW EXPENSE
if (addExpenseButton) {
addExpenseButton.addEventListener("click", () => {
  newExpenseContainer.style.display = "block";
  inputProjectExpenseDate.focus();
});
};


