# Requirements Document

## Introduction

The **To-Do List Life Dashboard** is a client-side personal homepage and productivity hub built with HTML, CSS, and Vanilla JavaScript. It runs entirely in the browser with no backend server, persisting all user data in the browser's Local Storage API. The dashboard provides four core productivity widgets — a time/date greeting, a Pomodoro focus timer, a task management list, and a quick-links launcher — as well as three optional challenge features: light/dark mode, custom name in the greeting, and custom Pomodoro timer duration.

---

## Glossary

- **Dashboard**: The single-page web application that serves as the personal homepage and productivity hub.
- **Greeting_Widget**: The UI section that displays the current time, date, and a personalized welcome message.
- **Timer_Widget**: The UI section that implements the focus (Pomodoro) countdown timer.
- **Todo_Widget**: The UI section that manages the user's task list.
- **Links_Widget**: The UI section that manages and launches quick-access website links.
- **Storage_Manager**: The module responsible for reading and writing all data to the browser Local Storage API.
- **Theme_Controller**: The module responsible for toggling and persisting the light/dark visual theme.
- **Task**: A user-defined item in the Todo_Widget with a text description, completion status, and unique identifier.
- **Link**: A user-defined shortcut in the Links_Widget with a display label and a URL.
- **Pomodoro_Duration**: The configurable countdown duration (in minutes) for the Timer_Widget.
- **Session**: A single browser tab lifetime from page load to page unload.

---

## Requirements

### Requirement 1: Dashboard Layout and Initialization

**User Story:** As a user, I want a clean, single-page dashboard that loads instantly, so that I can access all my productivity widgets without delay or setup.

#### Acceptance Criteria

1. THE Dashboard SHALL render all four widgets (Greeting_Widget, Timer_Widget, Todo_Widget, Links_Widget) within a single HTML page.
2. WHEN the Dashboard loads, THE Dashboard SHALL display all widgets fully composed and ready to interact with in under 1 second on a modern browser.
3. WHEN the Dashboard loads, THE Storage_Manager SHALL read all persisted data from Local Storage and populate each widget before the first paint is visible to the user.
4. IF Local Storage is empty or unavailable, THEN THE Dashboard SHALL display each widget in its default empty state without throwing a JavaScript error.
5. THE Dashboard SHALL be usable as a standalone file opened directly in a browser (file:// protocol) without requiring a local server.

---

### Requirement 2: Greeting Widget

**User Story:** As a user, I want to see the current time, date, and a contextual greeting, so that the dashboard feels personal and time-aware.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Greeting_Widget SHALL display the current local date formatted as day-of-week, month, day, and year (e.g., "Monday, October 26, 2026").
2. THE Greeting_Widget SHALL display the current local time in hours and minutes, updating every 60 seconds.
3. WHEN the current local time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting prefix "Good morning".
4. WHEN the current local time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting prefix "Good afternoon".
5. WHEN the current local time is between 18:00 and 04:59, THE Greeting_Widget SHALL display the greeting prefix "Good evening".

---

### Requirement 3: Custom Name in Greeting (Challenge 2)

**User Story:** As a user, I want to set my name so that the greeting addresses me personally.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide an input control that allows the user to enter a custom display name.
2. WHEN the user submits a non-empty name, THE Greeting_Widget SHALL append the name to the greeting message (e.g., "Good morning, Giovanni!").
3. WHEN the user submits an empty name, THE Greeting_Widget SHALL display the greeting without a personalized name suffix.
4. WHEN the user saves a name, THE Storage_Manager SHALL persist the name to Local Storage under a dedicated key.
5. WHEN the Dashboard loads and a persisted name exists in Local Storage, THE Greeting_Widget SHALL display the greeting with the persisted name without requiring the user to re-enter it.

---

### Requirement 4: Focus Timer Widget

**User Story:** As a user, I want a countdown focus timer with Start, Stop, and Reset controls, so that I can manage Pomodoro-style work sessions.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Timer_Widget SHALL display the Pomodoro_Duration as a countdown in MM:SS format (default 25:00).
2. WHEN the user activates the Start control, THE Timer_Widget SHALL begin counting down one second per real second.
3. WHEN the timer is counting down and the user activates the Stop control, THE Timer_Widget SHALL pause the countdown and retain the remaining time.
4. WHEN the user activates the Start control on a paused timer, THE Timer_Widget SHALL resume the countdown from the retained remaining time.
5. WHEN the user activates the Reset control, THE Timer_Widget SHALL stop the countdown and restore the display to the full Pomodoro_Duration.
6. WHEN the countdown reaches 00:00, THE Timer_Widget SHALL stop automatically and display a visual or audio notification to the user.
7. WHILE the timer is counting down, THE Timer_Widget SHALL keep the Start control visually inactive and the Stop control visually active to reflect the current state.

---

### Requirement 5: Custom Pomodoro Duration (Challenge 3)

**User Story:** As a user, I want to configure the focus timer duration, so that I can adapt it to my preferred work interval length.

#### Acceptance Criteria

1. THE Timer_Widget SHALL provide an input control that allows the user to enter a Pomodoro_Duration in whole minutes between 1 and 60.
2. WHEN the user submits a valid Pomodoro_Duration, THE Timer_Widget SHALL update the countdown display to the new duration in MM:SS format.
3. WHEN the user submits a value outside the range 1–60 or a non-numeric value, THE Timer_Widget SHALL reject the input and display an inline error message.
4. WHEN the user saves a valid Pomodoro_Duration, THE Storage_Manager SHALL persist the value to Local Storage under a dedicated key.
5. WHEN the Dashboard loads and a persisted Pomodoro_Duration exists in Local Storage, THE Timer_Widget SHALL initialize the countdown to the persisted duration.

---

### Requirement 6: To-Do List Widget

**User Story:** As a user, I want to manage a task list where I can add, edit, complete, and delete tasks, so that I can track my work items directly on the dashboard.

#### Acceptance Criteria

1. THE Todo_Widget SHALL provide a text input and an Add control that allow the user to create a new Task.
2. WHEN the user submits a non-empty task description, THE Todo_Widget SHALL add the Task to the visible list and persist the updated task list via the Storage_Manager.
3. WHEN the user submits an empty task description, THE Todo_Widget SHALL reject the input and not add a blank Task.
4. WHEN the user activates the complete control on a Task, THE Todo_Widget SHALL toggle the Task's completion status and update the visual style to distinguish completed tasks from pending tasks.
5. WHEN the user activates the delete control on a Task, THE Todo_Widget SHALL remove the Task from the list and persist the updated task list via the Storage_Manager.
6. WHEN the user activates the edit control on a Task, THE Todo_Widget SHALL present the Task description in an editable state that allows the user to modify and save the updated text.
7. WHEN the user saves an edited Task, THE Todo_Widget SHALL update the Task description in the list and persist the updated task list via the Storage_Manager.
8. WHEN the Dashboard loads and persisted tasks exist in Local Storage, THE Todo_Widget SHALL render all persisted tasks in their saved completion state.

---

### Requirement 7: Prevent Duplicate Tasks (Challenge 4)

**User Story:** As a user, I want the system to prevent me from adding duplicate tasks, so that my list stays clean and unambiguous.

#### Acceptance Criteria

1. WHEN the user submits a new task description that is identical (case-insensitive) to an existing Task in the list, THE Todo_Widget SHALL reject the submission and display an inline error message indicating the duplicate.
2. WHEN the user edits a Task and saves a description that is identical (case-insensitive) to another existing Task in the list, THE Todo_Widget SHALL reject the save and display an inline error message.
3. WHEN the submitted description is unique (case-insensitive) among all existing tasks, THE Todo_Widget SHALL accept it normally per Requirement 6.

---

### Requirement 8: Sort Tasks (Challenge 5)

**User Story:** As a user, I want to sort my task list, so that I can view tasks in a meaningful order.

#### Acceptance Criteria

1. THE Todo_Widget SHALL provide a sort control that allows the user to choose a sort order.
2. WHEN the user selects the "Pending first" sort order, THE Todo_Widget SHALL display all incomplete tasks before completed tasks.
3. WHEN the user selects the "Completed first" sort order, THE Todo_Widget SHALL display all completed tasks before incomplete tasks.
4. WHEN the user selects the "Alphabetical (A–Z)" sort order, THE Todo_Widget SHALL display tasks sorted ascending by task description text, case-insensitive.
5. WHEN a sort order is active and the user adds or modifies a Task, THE Todo_Widget SHALL re-apply the current sort order to the updated list immediately.
6. WHEN the Dashboard loads, THE Todo_Widget SHALL apply the default sort order (Pending first) unless the user has previously selected a different sort order that has been persisted.

---

### Requirement 9: Quick Links Widget

**User Story:** As a user, I want to save and launch quick-access links to my favorite websites, so that I can navigate to them with a single click from the dashboard.

#### Acceptance Criteria

1. THE Links_Widget SHALL provide input controls for a display label and a URL that allow the user to add a new Link.
2. WHEN the user submits a Link with both a non-empty label and a non-empty URL, THE Links_Widget SHALL add the Link as a clickable button and persist the updated link list via the Storage_Manager.
3. WHEN the user submits a Link with an empty label or an empty URL, THE Links_Widget SHALL reject the input and display an inline error message.
4. WHEN the user activates a Link button, THE Links_Widget SHALL open the associated URL in a new browser tab.
5. WHEN the user activates the delete control on a Link, THE Links_Widget SHALL remove the Link and persist the updated link list via the Storage_Manager.
6. WHEN the Dashboard loads and persisted links exist in Local Storage, THE Links_Widget SHALL render all persisted links as clickable buttons.
7. WHEN a submitted URL does not begin with "http://" or "https://", THE Links_Widget SHALL automatically prepend "https://" before storing and opening the URL.

---

### Requirement 10: Light / Dark Mode (Challenge 1)

**User Story:** As a user, I want to toggle between light and dark visual themes, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a theme toggle control visible at all times.
2. WHEN the user activates the theme toggle control, THE Theme_Controller SHALL switch the active theme between light mode and dark mode.
3. WHEN the Theme_Controller applies a theme, THE Dashboard SHALL update all widget colors, backgrounds, and text to match the selected theme without a page reload.
4. WHEN the user selects a theme, THE Storage_Manager SHALL persist the selected theme to Local Storage under a dedicated key.
5. WHEN the Dashboard loads and a persisted theme exists in Local Storage, THE Theme_Controller SHALL apply the persisted theme before the first paint.
6. IF no persisted theme exists in Local Storage, THEN THE Theme_Controller SHALL apply the light theme as the default.

---

### Requirement 11: Data Persistence

**User Story:** As a user, I want all my data to survive page refreshes, so that I don't lose my tasks, links, or settings between sessions.

#### Acceptance Criteria

1. THE Storage_Manager SHALL persist task list data, link list data, custom name, Pomodoro_Duration, active sort order, and active theme each time any of those values changes.
2. WHEN the Dashboard loads, THE Storage_Manager SHALL restore all persisted values and supply them to each widget during initialization.
3. IF a Local Storage read or write operation fails, THEN THE Storage_Manager SHALL catch the error silently and the Dashboard SHALL continue to function using in-memory state for the remainder of the Session.
4. THE Storage_Manager SHALL use distinct, namespaced Local Storage keys (prefixed with "tld_") for each data category to avoid collisions with other applications.

---

### Requirement 12: File Structure and Code Quality

**User Story:** As a developer, I want a clean, maintainable file structure, so that the code is easy to read and extend.

#### Acceptance Criteria

1. THE Dashboard SHALL be delivered as exactly one HTML file, exactly one CSS file located in a css/ directory, and exactly one JavaScript file located in a js/ directory.
2. THE Dashboard SHALL contain no external framework dependencies; all logic SHALL be implemented in Vanilla JavaScript.
3. THE Dashboard SHALL contain no calls to external backend APIs; all data operations SHALL use the Local Storage API exclusively.
4. WHEN the JavaScript file is loaded, THE Dashboard SHALL not throw any uncaught exceptions during normal operation.
