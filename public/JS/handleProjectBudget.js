const addProjectBudgetButton = document.getElementById("add-budget-btn");
const newProjectBudgetContainer = document.getElementById("new-projectbudget-container");
const inputProjectBudgetElement = document.getElementById("projectbudget-input");

const addExpenseButton = document.getElementById("add-expense-btn");
const newExpenseContainer = document.getElementById("new-expense-container");
const inputProjectExpenseDate = document.getElementById("projectExpenseDate");
const inputProjectExpenseDescription = document.getElementById("projectExpenseDescription");
const inputProjectExpenseAmount = document.getElementById("projectExpenseAmount");

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

// EVENT LISTENER TO ADD A NEW EXPENSE
if (addExpenseButton) {
addExpenseButton.addEventListener("click", () => {
  newExpenseContainer.style.display = "block";
  inputProjectExpenseDate.focus();
  inputProjectExpenseDate.value = currentDate;
});
};

// EVENT LISTENER TO EDIT PROJECT BUDGET
if (editProjectBudgetButton) {
  editProjectBudgetButton.addEventListener("click", () => {
    editProjectBudgetContainer.style.display = "block";
    inputNewProjectBudgetElement.focus();
  });
};


// CLOSE EXPENSE FORM //
function closeExpenseForm() {
  newExpenseContainer.style.display = "none";
};

