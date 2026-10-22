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
    const deleteButton = document.createElement("button");

    // Configure the completion checkbox.
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;

    // Associate the label with the checkbox.
    label.htmlFor = checkbox.id;
    label.textContent = task.title;

    // Style completed tasks.
    if (task.completed) {
      label.style.textDecoration = "line-through";
      label.style.color = "var(--color-muted)";
    }

    // Configure the Delete button.
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.taskId = task.id;
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);

    // Add the task elements to the list item.
    listItem.append(checkbox, label, deleteButton);
    taskList.append(listItem);
  }
}
