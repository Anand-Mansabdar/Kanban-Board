const tasksData = {};

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const completed = document.getElementById("completed");
const tasks = document.querySelectorAll(".task");

const toggleModal = document.getElementById("toggle-modal");
const modal = document.getElementById("modal");
const modalBg = document.getElementById("modal-bg");
const addTaskBtn = document.getElementById("create-new-task");

let draggedElement = null;

const updateLocalStorage = () => {
  [todo, progress, completed].forEach((column) => {
    const tasks = column.querySelectorAll(".task");
    const count = column.querySelector(".right");

    tasksData[column.id] = Array.from(tasks).map((task) => {
      return {
        title: task.querySelector("h2").innerText,
        description: task.querySelector("p").innerText,
        status: column.id,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    count.innerText = `Total: ${tasks.length}`;
  });
};

const handleDeleteTask = (taskElement) => {
  taskElement.remove();
  updateLocalStorage();
};

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    console.log(col, data[col]);
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      const div = document.createElement("div");
      div.classList.add("task");
      div.setAttribute("draggable", true);
      div.innerHTML = `
      <h2>${task.title}</h2>
      <p>${task.description}</p>
      <button>Delete task</button>
      `;

      column.appendChild(div);

      div.addEventListener("drag", (e) => {
        // console.log("dragging", e);
        draggedElement = div;
      });

      div.querySelector("button").addEventListener("click", () => {
        handleDeleteTask(div);
      });
    });

    const tasks = column.querySelectorAll(".task");
    const count = column.querySelector(".right");
    count.innerText = `Total: ${tasks.length}`;
  }
}

tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    // console.log("dragging", e);
    draggedElement = task;
  });
});

// progress.addEventListener("dragenter", (e) => {
//   progress.classList.add("hover-over");
// });

// progress.addEventListener("dragleave", (e) => {
//   progress.classList.remove("hover-over");
// });

// The above should be done for all the task columns but the code becomes repetitive. So we create a function for dragenter and dragleave

const handleDragEvents = (column) => {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    console.log("dropped", draggedElement, column);
    column.appendChild(draggedElement);
    column.classList.remove("hover-over");

    updateLocalStorage();
  });
};

handleDragEvents(todo);
handleDragEvents(progress);
handleDragEvents(completed);

toggleModal.addEventListener("click", (e) => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", (e) => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", (e) => {
  const taskTitle = document.getElementById("task-title").value;
  const taskDescription = document.getElementById("task-description").value;

  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", true);
  div.innerHTML = `
  <h2>${taskTitle}</h2>
  <p>${taskDescription}</p>
  <button>Delete task</button>
  `;

  todo.appendChild(div);

  updateLocalStorage();

  div.addEventListener("drag", (e) => {
    // console.log("dragging", e);
    draggedElement = div;
  });

  div.querySelector("button").addEventListener("click", () => {
    handleDeleteTask(div);
  });

  modal.classList.remove("active");
});
