const addExpenseBtn = document.getElementById("add-expense-btn");
const newItemContainer = document.querySelector(".new-item-container");
const inputExpenseDate = document.querySelector("expense-date");
const inputExpenseDescription = document.querySelector("expense-description");
const inputExpenseAmount = document.querySelector("expense-amount");

addExpenseBtn.addEventListener("click", () => {
  newItemContainer.style.display = "block";
  inputExpenseDate.focus();
});