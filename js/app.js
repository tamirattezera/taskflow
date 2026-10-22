import { addTask, toggleTask, deleteTask } from "./state.js";
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
