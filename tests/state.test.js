import { beforeEach, test } from "node:test";
import assert from "node:assert/strict";

const STORAGE_KEY = "taskflow-tasks";
const storage = new Map();

const originalSetItem = (key, value) => {
  storage.set(key, String(value));
};

globalThis.localStorage = {
  getItem(key) {
    return storage.has(key) ? storage.get(key) : null;
  },

  setItem: originalSetItem,
};

let state;

beforeEach(async () => {
  // Reset the mock before each test to prevent test interference.
  globalThis.localStorage.setItem = originalSetItem;
  storage.clear();

  // Re-import the module so each test starts with fresh task state.
  const moduleUrl = new URL("../js/state.js", import.meta.url);
  moduleUrl.searchParams.set("testRun", String(Math.random()));

  state = await import(moduleUrl.href);
});

test("creates a task with a trimmed title", () => {
  const task = state.addTask("  Learn testing  ");

  assert.ok(task);
  assert.equal(task.title, "Learn testing");
  assert.equal(task.completed, false);
  assert.equal(task.updatedAt, null);
  assert.equal(state.tasks.length, 1);

  const savedTasks = JSON.parse(storage.get(STORAGE_KEY));
  assert.equal(savedTasks[0].title, "Learn testing");
});

test("rejects an empty or whitespace-only title", () => {
  assert.equal(state.addTask(""), null);
  assert.equal(state.addTask("    "), null);
  assert.equal(state.tasks.length, 0);
  assert.equal(storage.has(STORAGE_KEY), false);
});

test("does not add a task when saving fails", () => {
  globalThis.localStorage.setItem = () => {
    throw new Error("Simulated storage failure");
  };

  const task = state.addTask("Should not be saved");

  assert.equal(task, null);
  assert.equal(state.tasks.length, 0);
});

test("toggles task completion and persists the change", () => {
  const task = state.addTask("Complete this task");

  assert.equal(state.toggleTask(task.id), true);
  assert.equal(task.completed, true);

  const savedTasks = JSON.parse(storage.get(STORAGE_KEY));
  assert.equal(savedTasks[0].completed, true);
});

test("restores completion state when saving fails", () => {
  const task = state.addTask("Keep this task active");
  const previousUpdatedAt = task.updatedAt;

  globalThis.localStorage.setItem = () => {
    throw new Error("Simulated storage failure");
  };

  assert.equal(state.toggleTask(task.id), false);
  assert.equal(task.completed, false);
  assert.equal(task.updatedAt, previousUpdatedAt);
});

test("edits and persists a task title", () => {
  const task = state.addTask("Original title");

  assert.equal(state.updateTask(task.id, "  Updated title  "), true);
  assert.equal(task.title, "Updated title");

  const savedTasks = JSON.parse(storage.get(STORAGE_KEY));
  assert.equal(savedTasks[0].title, "Updated title");
});

test("restores the original title when saving fails", () => {
  const task = state.addTask("Original title");
  const previousUpdatedAt = task.updatedAt;

  globalThis.localStorage.setItem = () => {
    throw new Error("Simulated storage failure");
  };

  assert.equal(state.updateTask(task.id, "New title"), false);
  assert.equal(task.title, "Original title");
  assert.equal(task.updatedAt, previousUpdatedAt);
});

test("deletes a task and persists the change", () => {
  const first = state.addTask("First task");
  const second = state.addTask("Second task");

  assert.equal(state.deleteTask(first.id), true);

  assert.deepEqual(
    state.tasks.map((task) => task.id),
    [second.id],
  );

  const savedTasks = JSON.parse(storage.get(STORAGE_KEY));

  assert.deepEqual(
    savedTasks.map((task) => task.id),
    [second.id],
  );
});

test("restores a deleted task at its original position when saving fails", () => {
  const first = state.addTask("First task");
  const middle = state.addTask("Middle task");
  const last = state.addTask("Last task");

  globalThis.localStorage.setItem = () => {
    throw new Error("Simulated storage failure");
  };

  assert.equal(state.deleteTask(middle.id), false);

  assert.deepEqual(
    state.tasks.map((task) => task.id),
    [first.id, middle.id, last.id],
  );
});

test("rejects operations for a task that does not exist", () => {
  assert.equal(state.toggleTask("missing-task"), false);
  assert.equal(state.deleteTask("missing-task"), false);
  assert.equal(state.updateTask("missing-task", "New title"), false);

  assert.equal(state.tasks.length, 0);
});

test("rejects an empty or whitespace-only edited title", () => {
  const task = state.addTask("Keep the original title");

  assert.equal(state.updateTask(task.id, ""), false);
  assert.equal(state.updateTask(task.id, "   "), false);

  assert.equal(task.title, "Keep the original title");
  assert.equal(state.tasks.length, 1);
});

test("does not change the stored title after an invalid edit", () => {
  const task = state.addTask("Valid title");

  assert.equal(state.updateTask(task.id, "   "), false);

  const savedTasks = JSON.parse(storage.get(STORAGE_KEY));

  assert.equal(savedTasks.length, 1);
  assert.equal(savedTasks[0].title, "Valid title");
});
