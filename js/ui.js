import { tasks } from "./state.js";

const taskList = document.querySelector("#task-list");

export function renderTasks() {
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const emptyState = document.createElement("li");

    emptyState.id = "empty-state";
    emptyState.textContent = "No tasks yet. Add your first task above.";

    taskList.append(emptyState);
    return;
  }

  for (const task of tasks) {
    const listItem = document.createElement("li");

    listItem.textContent = task.title;

    taskList.append(listItem);
  }
}
