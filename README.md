# TaskFlow

A simple task management application built with vanilla JavaScript, HTML, and CSS.

TaskFlow helps users organize everyday work by creating tasks, editing titles, tracking completion, and filtering tasks by status. The project focuses on strengthening JavaScript fundamentals, modular application design, state management, browser storage, error handling, and automated testing.

> **Project status:** Learning project in progress. The state-management test suite passes, but comprehensive browser testing and production readiness have not been established.

## Features

- **Create tasks** with trimmed, non-empty titles.
- **Edit tasks** to update their titles.
- **Track completion** using checkboxes.
- **Delete tasks** when they are no longer needed.
- **Filter tasks** by All, Active, or Completed.
- **Persist task data** in browser `localStorage`.
- **Handle storage failures** by restoring in-memory state when saving fails.
- **Recover from invalid stored data** by handling malformed JSON and ignoring invalid task entries.
- **Responsive styling** with a small-screen layout adjustment.
- **Accessibility considerations** including semantic HTML, associated labels, descriptive action-button names, keyboard-focus styles, and a live task-list region.

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript using ES modules
- Browser `localStorage`
- Node.js built-in test runner

No frontend framework or third-party runtime dependency is required by the current `package.json`.

## Getting Started

### Prerequisites

- A modern web browser.
- Node.js and npm to run the automated tests.
- A local HTTP server to serve the application.

### Run the application

Clone the repository and navigate into its directory:

```bash
git clone git@github.com:tamirattezera/taskflow.git
cd taskflow
```

Start a local development server with Python:

```bash
python3 -m http.server 8000
```

Open the following address in your browser:

```text
http://localhost:8000
```

If Python is unavailable, use another local HTTP server.

**Note:** The application uses JavaScript modules and browser storage, so serving it over HTTP is preferable to opening `index.html` directly.

### Run the automated tests

From the project root, run:

```bash
npm test
```

The current test suite contains 15 tests for state-management behavior. The latest verified run reported **15 passing tests and 0 failures**.

Some error messages may appear in the console during testing because tests deliberately simulate storage failures and corrupted stored data. Those messages are expected in the relevant test scenarios.

## How to Use TaskFlow

1. Enter a task title in the input field.
2. Select **Add task**.
3. Use the checkbox to mark a task complete or active.
4. Select **Edit** to change a task title.
5. Select **Delete** to remove a task.
6. Use **All**, **Active**, or **Completed** to filter the list.

Tasks are stored in the current browser's local storage. They are not synchronized across browsers or devices.

## Project Structure

```text
taskflow/
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── state.js
│   └── ui.js
├── tests/
│   └── state.test.js
├── index.html
└── package.json
```

### Responsibilities

| File                  | Responsibility                                                              |
| --------------------- | --------------------------------------------------------------------------- |
| `index.html`          | Defines the application structure and accessible HTML elements.             |
| `css/styles.css`      | Controls layout, task styling, responsive behavior, and focus states.       |
| `js/app.js`           | Coordinates user events, filtering, state operations, and UI updates.       |
| `js/state.js`         | Manages task data, validation, persistence, and recovery from failed saves. |
| `js/ui.js`            | Renders task items and the empty state in the DOM.                          |
| `tests/state.test.js` | Tests state operations, validation, persistence, and recovery scenarios.    |
| `package.json`        | Defines project metadata and the test command.                              |

## Architecture Overview

TaskFlow separates its main responsibilities into three JavaScript modules:

1. **Application coordination — `app.js`:** listens for user interactions, calls state operations, and refreshes the visible task list.
2. **State management — `state.js`:** owns the task collection and its persistence behavior.
3. **UI rendering — `ui.js`:** converts the currently visible tasks into DOM elements.

The application uses event delegation for task-list actions, allowing events from dynamically rendered controls to be handled by their parent list.

This separation makes the code easier to understand, maintain, and test than placing all behavior in a single script.

## Task Data Model

A task is represented by an object with the following fields:

| Field       | Type             | Purpose                                                                                                 |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `id`        | String           | Unique task identifier generated with `crypto.randomUUID()`.                                            |
| `title`     | String           | Task description.                                                                                       |
| `completed` | Boolean          | Whether the task is complete.                                                                           |
| `createdAt` | String           | Creation timestamp in ISO format.                                                                       |
| `updatedAt` | String or `null` | Timestamp of the latest successful edit or completion change, or `null` if no such change has occurred. |

The collection is stored under the `taskflow-tasks` key in browser `localStorage`.

## State Management and Error Handling

TaskFlow uses explicit checks and rollback behavior to avoid leaving the in-memory task collection in an inconsistent state when persistence fails.

- **Create:** removes the newly added task if saving fails.
- **Update:** restores the previous title and update timestamp if saving fails.
- **Toggle completion:** restores the previous completion value and update timestamp if saving fails.
- **Delete:** reinserts the deleted task at its original position if saving fails.
- **Load:** starts with an empty collection when storage is empty, malformed, or not an array, and filters out entries that fail the current structural checks.

This approach provides useful practice in managing mutable state and handling failures. Browser storage is still local to the current browser, and this implementation is not a substitute for a server-backed database.

## Testing

The automated tests in `tests/state.test.js` cover:

- Creating tasks and trimming titles.
- Rejecting empty or whitespace-only titles.
- Toggling completion and persisting changes.
- Editing titles and persisting changes.
- Deleting tasks and persisting changes.
- Restoring state when storage writes fail.
- Rejecting operations for missing task IDs.
- Handling empty storage and corrupted JSON.
- Ignoring invalid task entries during loading.

The verified result is 15 passing tests with no failures.

**Testing scope:** These tests exercise state-management behavior. They do not establish comprehensive coverage of browser rendering, keyboard interactions, responsive layouts, or every end-to-end user workflow.

## Current Limitations

- Data is stored only in the browser's local storage.
- There is no user authentication or cross-device synchronization.
- Editing uses the browser's built-in prompt dialog.
- Automated test coverage is focused on state management.
- No build, deployment, or continuous-integration workflow is currently defined in `package.json`.
- Production readiness and comprehensive accessibility have not been verified.

## Potential Next Steps

1. Add browser-level tests for the primary user workflows.
2. Improve task editing with an accessible in-page form or dialog.
3. Add more robust validation and user-facing error feedback.
4. Evaluate accessibility and responsive behavior across browsers and screen sizes.
5. Consider a deployment workflow after testing and documenting the application more comprehensively.

## Learning Outcomes

This project provides practical experience with:

- JavaScript modules and separation of concerns.
- DOM manipulation and event delegation.
- Array operations and state transitions.
- Browser storage and JSON serialization.
- Input validation and defensive programming.
- Rollback strategies for failed persistence.
- Automated tests with Node.js.
- Semantic HTML and accessibility fundamentals.

## Project Philosophy

TaskFlow is being developed through an incremental engineering workflow: inspect, implement, test, review, document, and improve.

The goal is not simply to make the application work, but to understand why it works, how it behaves when something fails, and how its design can be improved.
