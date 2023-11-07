const addTodoButton = document.getElementById("add-todo-btn");
const newItemContainer = document.querySelector(".new-item-container");
const inputElement = document.querySelector("#todo-input");
const todoCache = [];


// EVENT LISTENER TO ADD A TODO
addTodoButton.addEventListener("click", () => {
  newItemContainer.style.display = "block";
  inputElement.focus();
});

// CLOSE TODO FORM
function closeToDoForm() {
  newItemContainer.style.display = "none";
};

// CHANGE TODO COMPLETED STATUS
// async function toggleCompleted(projectId, todoId) {
//   try {
//     const response = await fetch(`/projekte/${projectId}/aufgaben/${todoId}`, {
//       method: "PUT",
//     });

//     if (response.ok) {
//       location.reload();
//     } else {
//       console.error("Toggle failed");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

async function toggleCompleted(projectId, todoId) {
  try {
    const response = await fetch(`/projekte/${projectId}/aufgaben/${todoId}`, {
      method: "PUT",
    });

    if (response.ok) {
      // Update the UI without a page reload
      const checkbox = document.getElementById(`todo-checkbox-${todoId}`);
      const listItem = checkbox.closest('li');
      if (checkbox.checked) {
        listItem.classList.add('completed');
      } else {
        listItem.classList.remove('completed');
      }
    } else {
      console.error("Toggle failed");
    }
  } catch (error) {
    console.error(error);
  }
};





