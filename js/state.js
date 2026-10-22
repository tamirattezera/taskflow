export const tasks = [];

export function addTask(title) {
  const task = {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  tasks.push(task);

  return task;
}

export function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return false;
  }

  task.completed = !task.completed;
  task.updatedAt = new Date().toISOString();

  return true;
}
export function deleteTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  return true;
}
export function updateTask(id, newTitle) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return false;
  }

  const trimmedTitle = newTitle.trim();

  if (!trimmedTitle) {
    return false;
  }

  task.title = trimmedTitle;
  task.updatedAt = new Date().toISOString();

  return true;
}