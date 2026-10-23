const STORAGE_KEY = "taskflow-tasks";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.filter(
      (task) =>
        task !== null &&
        typeof task === "object" &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.completed === "boolean",
    );
  } catch (error) {
    console.error("Unable to load tasks from localStorage:", error);
    return [];
  }
}

export const tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Unable to save tasks to localStorage:", error);
    return false;
  }
}


export function addTask(title) {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return null;
  }

  const task = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  tasks.push(task);

  if (!saveTasks()) {
    tasks.pop();
    return null;
  }

  return task;
}

export function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return false;
  }

  task.completed = !task.completed;
  task.updatedAt = new Date().toISOString();

  saveTasks();
  return true;
}
export function deleteTask(id) {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);

  saveTasks();
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

  saveTasks();
  return true;
}
