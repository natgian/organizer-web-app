const cancelButton = document.getElementById("cancel-button");

cancelButton.addEventListener("click", () => {
  console.log("Cancel button clicked");
  window.history.back();
});



