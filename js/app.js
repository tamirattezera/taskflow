import { addTask, toggleTask, deleteTask, updateTask, tasks } from "./state.js";
import { renderTasks } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskList = document.querySelector("#task-list");

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

  if (!title) {
    taskTitleInput.focus();
    return;
  }

  addTask(title);
  renderTasks();

  taskForm.reset();
  taskTitleInput.focus();
});
taskList.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  const taskId = event.target.id.replace("task-", "");

  toggleTask(taskId);
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('button[data-action="delete"]');

  if (!deleteButton || !taskList.contains(deleteButton)) {
    return;
  }

  const taskId = deleteButton.dataset.taskId;

  deleteTask(taskId);
  renderTasks();
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

  if (updateTask(taskId, newTitle)) {
    renderTasks();
  } else {
    alert("Task title cannot be empty.");
  }
});
renderTasks();
