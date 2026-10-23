import { addTask, toggleTask, deleteTask, updateTask, tasks } from "./state.js";
import { renderTasks } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskList = document.querySelector("#task-list");
const taskFilters = document.querySelector("nav[aria-label='Filter tasks']");

let currentFilter = "all";

function updateTaskView() {
  let visibleTasks = tasks;

  if (currentFilter === "active") {
    visibleTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    visibleTasks = tasks.filter((task) => task.completed);
  }

  renderTasks(visibleTasks);
}

taskFilters.addEventListener("click", (event) => {
  const filterButton = event.target.closest("button[data-filter]");

  if (!filterButton || !taskFilters.contains(filterButton)) {
    return;
  }

  currentFilter = filterButton.dataset.filter;

  for (const button of taskFilters.querySelectorAll("button[data-filter]")) {
    button.setAttribute("aria-pressed", String(button === filterButton));
  }

  updateTaskView();
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

  if (!title) {
    taskTitleInput.focus();
    return;
  }

  const createdTask = addTask(title);

  if (!createdTask) {
    alert("Unable to save your task. Please try again.");
    return;
  }

  updateTaskView();
  taskForm.reset();
  taskTitleInput.focus();
});

taskList.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  const taskId = event.target.id.replace("task-", "");

  toggleTask(taskId);
  updateTaskView();
});

taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('button[data-action="delete"]');

  if (!deleteButton || !taskList.contains(deleteButton)) {
    return;
  }

  const taskId = deleteButton.dataset.taskId;

  if (!deleteTask(taskId)) {
    alert("Unable to delete the task. Please try again.");
    updateTaskView();
    return;
  }

  updateTaskView();
});

taskList.addEventListener("click", (event) => {
  const editButton = event.target.closest('button[data-action="edit"]');

  if (!editButton || !taskList.contains(editButton)) {
    return;
  }

  const taskId = editButton.dataset.taskId;
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  const newTitle = prompt("Edit task title:", task.title);

  if (newTitle === null) {
    return;
  }

  if (!newTitle.trim()) {
    alert("Task title cannot be empty.");
    return;
  }

  if (!updateTask(taskId, newTitle)) {
    alert("Unable to save the task changes. Please try again.");
    updateTaskView();
    return;
  }

  updateTaskView();
});

updateTaskView();
