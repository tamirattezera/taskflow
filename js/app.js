import { addTask } from "./state.js";
import { renderTasks } from "./ui.js";

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");

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
