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
