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

// TOGGLE COMPLETED
async function toggleCompleted(projectId, todoId) {
  try {
    const response = await fetch(`/projekte/${projectId}/aufgaben/${todoId}`, {
      method: "PUT",
    });

    if (response.ok) {
      const checkbox = document.getElementById(`todo-checkbox-${todoId}`);
      const listItem = checkbox.closest("li");
      if (checkbox.checked) {
        listItem.classList.add('completed');
      } else {
        listItem.classList.remove('completed');
      }
    //After toggling, fetch and update the completed count
      fetchAndUpdateCompletedCount(projectId);
    } else {
      console.error("Toggle failed");
    }
  } catch (error) {
    console.error(error);
  }
};

// GET COMPLETED TODOS COUNT
async function fetchAndUpdateCompletedCount(projectId) {
  try {
    const response = await fetch(`/projekte/${projectId}/aufgaben/count`, {
      method: "PUT",
    });

    if (response.ok) {
      const data = await response.json();
      updateCompletedCount(data);
    } else {
      console.error("Failed to fetch completed count");
    }
  } catch (error) {
    console.error(error);
  }
};

//UPDATE COMPLETED TODOS COUNT
function updateCompletedCount(data) {
  const completedCount = document.getElementById("completed-count");
  const openCount = document.getElementById("open-count");

  if (completedCount && openCount) {
    completedCount.textContent = data.completedCount;
    openCount.textContent = data.openCount;
  }
};






