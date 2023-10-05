const addItemButton = document.getElementById("add-todo-btn");
const newItemContainer = document.querySelector(".new-item-container");
const inputElement = document.querySelector("#todo-input");


// EVENT LISTENER TO ADD A TODO
addItemButton.addEventListener("click", () => {
  newItemContainer.style.display = "block";
  inputElement.focus();
});

// EVENT LISTENER 

// CHANGE TODO COMPLETED STATUS
async function toggleCompleted(projectId, todoId) {
  try {
    const response = await fetch(`/projekte/${projectId}/aufgaben/${todoId}`, {
      method: "PUT",
    });

    if (response.ok) {
      // Refresh the page or update the UI as needed
      location.reload();
    } else {
      console.error("Toggle failed");
    }
  } catch (error) {
    console.error(error);
  }
};

