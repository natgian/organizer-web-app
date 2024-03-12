const addTransactionBtn = document.getElementById("add-transaction-btn");
const newItemContainer = document.querySelector(".new-item-container");
const inputTransactionDate = document.querySelector("#transactionDate");
const inputTransactionDescription = document.querySelector("#transactionDescription");
const inputTransactionAmount = document.querySelector("#transactionAmount");
const currentDate = new Date().toISOString().split("T")[0];

addTransactionBtn.addEventListener("click", () => {
  newItemContainer.style.display = "block";
  inputTransactionDate.focus();
  inputTransactionDate.value = currentDate;
});

// CLOSE TRANSACTION FORM //
function closeTransactionForm() {
  newItemContainer.style.display = "none";
};