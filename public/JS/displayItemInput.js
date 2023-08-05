const addItemBtn = document.getElementById("add-item-btn");
const newItemContainer = document.querySelector(".new-item-container");

addItemBtn.addEventListener("click", () => {
  newItemContainer.style.display = "block";
});