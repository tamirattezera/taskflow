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
    const checkbox = document.createElement("input");
    const label = document.createElement("label");

    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;

    label.htmlFor = checkbox.id;
    label.textContent = task.title;

    if (task.completed) {
      label.style.textDecoration = "line-through";
      label.style.color = "var(--color-muted)";
    }

    listItem.append(checkbox, label);
    taskList.append(listItem);
  }
}
