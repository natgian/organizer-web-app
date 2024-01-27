const addItemBtn = document.getElementById("add-item-btn");
const newItemContainer = document.querySelector(".new-item-container");
const inputElement = document.querySelector(".input");

addItemBtn.addEventListener("click", () => {
  newItemContainer.style.display = "block";
  inputElement.focus();
});

// CLOSE TRANSACTION FORM //
function closeInputForm() {
  event.preventDefault();
  newItemContainer.style.display = "none";
};