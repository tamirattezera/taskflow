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
