let taskInput = document.getElementById("todoinp");
let addTaskButton = document.getElementById("todobtn");
let todoList = document.getElementById("todo-list");
let todoTasksCount = document.getElementById("task-count");
let completedTasksCount = document.getElementById("done-Tasks");
let completedTodosList = document.getElementById("completed-List");
let updateTasksButton = document.getElementById("updatebtn");

const todos = JSON.parse(localStorage.getItem("todos")) || [];

const uniqueIdGenerator = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

updateTasksButton.style.display = "none";

let currentEditId = null;


const TASK_STATUS = {
  PENDING: "pending",
  DONE: "done",
};

const setItemInLocalStorage = () => {
    // get all todos , push and add.
    // gtetodosfromlocalstorage

  localStorage.setItem("todos", JSON.stringify(todos));
};

const addTaskInLocalStorage = (task) => {
  todos.push(task);
  setItemInLocalStorage();
};

const deleteTaskInLocalStorage = (id) => {
  const index = todos.findIndex((task) => task.id === id);
  if (index > -1) {
    todos.splice(index, 1);
    setItemInLocalStorage();
  }
};

const getTaskByIdFromLocalStorage = (id) => {
  return todos.find((task) => task.id === id);
};

const getPendingTodosCount = () => {
  return todos.filter((task) => task.status === TASK_STATUS.PENDING).length;
};

const getDoneTodosCount = () => {
  return todos.filter((task) => task.status === TASK_STATUS.DONE).length;
};

const clearTaskInput = () => {
  taskInput.value = "";
};

const clearTodoList = () => {
  todoList.innerHTML = "";
};

const getPendingTasks = () => {
  return todos.filter((task) => task.status === TASK_STATUS.PENDING);
};

const getDoneTasks = () => {
  return todos.filter((task) => task.status === TASK_STATUS.DONE);
};

const generatePendingTasks = (tasks) => {
  clearTodoList();
  tasks.forEach(function (task) {
    todoList.innerHTML += `
                <li>
                    <p>${task.title}</p>
                    <div>
                        <button onclick="doneTask('${task.id}')"><i class="fa-solid fa-check fa-xl"></i></button>
                        <button onclick="editTask('${task.id}')"><i class="fa-solid fa-pencil fa-lg"></i></button>
                        <button onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash" style="color: #B197FC"></i></button>
                    </div>
                </li>`;
  });
};

const generateDoneTasks = (tasks) => {
  completedTodosList.innerHTML = "";
  tasks.forEach(function (task) {
    completedTodosList.innerHTML += `
                <li>
                    ${task.title}
                </li>`;
  });
};

const updateTask = (id) => {
  let task = getTaskByIdFromLocalStorage(id);
  if (task) {
    task.title = taskInput.value;
    setItemInLocalStorage();
    renderList();
    updateTodoList();
  }
};

function editTask(id) {
  let editField = todos.find((v) => v.id == id);

  taskInput.value = editField.title;
  currentEditId = id;

  addTaskButton.style.display = "none";
  updateTasksButton.style.display = "inline-block";
}

const doneTask = (id) => {
  let task = getTaskByIdFromLocalStorage(id);
  if (task) {
    task.status = TASK_STATUS.DONE;
    setItemInLocalStorage();
    renderList();
    updateTodoList();
  }
};

const deleteTask = (id) => {
  deleteTaskInLocalStorage(id);
  renderList();
  updateTodoList();
};

function renderList(status = TASK_STATUS.PENDING) {
  switch (status) {
    case TASK_STATUS.PENDING:
      generatePendingTasks(getPendingTasks());
      break;
    case TASK_STATUS.DONE:
      generateDoneTasks(getDoneTasks());
      break;
    default:
      generatePendingTasks(getPendingTasks());
      break;
  }
}

function addTodo() {
  const uniqueId = uniqueIdGenerator();
  let inputValue = taskInput.value;

  if (inputValue === "") {
    alert("Task cannot be empty");
    return;
  }

  const todoPayload = {
    status: TASK_STATUS.PENDING,
    id: uniqueId,
    title: inputValue,
  };

  addTaskInLocalStorage(todoPayload);
  clearTaskInput();
  renderList();
  updateTodoList();
}

function updateTodoList() {
  renderList(TASK_STATUS.PENDING);
  todoTasksCount.innerHTML = getPendingTodosCount();
  completedTasksCount.innerHTML = getDoneTodosCount();
  renderList(TASK_STATUS.DONE);
}

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

updateTasksButton.addEventListener("click", function () {
  let inputValue = taskInput.value;
  if (inputValue !== "") {
    let todoIndex = todos.findIndex((task) => task.id === currentEditId);
    todos[todoIndex].title = inputValue;

    taskInput.value = "";

    addTaskButton.style.display = "inline-block";
    updateTasksButton.style.display = "none";
    currentEditId = null;

    renderList();
    localStorage.setItem("todos", JSON.stringify(todos));
  }
});
addTaskButton.addEventListener("click", addTodo);

renderList();
updateTodoList();
