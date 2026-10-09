# Implementation Plan: To-Do List Life Dashboard

## Overview

This plan breaks down the implementation of the To-Do List Life Dashboard into discrete, actionable tasks. The dashboard is a client-side single-page application built with vanilla JavaScript, HTML5, and CSS3, using browser Local Storage for persistence. The implementation follows a modular architecture with independent widgets coordinated through a central Storage Manager.

## Tasks

- [ ] 1. Set up project structure and core files
  - Create directory structure (css/, js/)
  - Create index.html with semantic HTML structure and all widget containers
  - Create css/styles.css with CSS reset and variable definitions
  - Create js/app.js with module skeleton
  - Set up basic HTML layout with header, main content area, and widget grid
  - _Requirements: 1.1, 1.5, 12.1, 12.2_

- [x] 2. Implement Storage Manager module
  - [ ] 2.1 Create StorageManager with Local Storage interface
    - Implement `get()`, `set()`, `remove()`, `isAvailable()`, and `getAll()` methods
    - Add namespace prefix "tld_" to all storage keys
    - Implement JSON serialization/deserialization
    - Add storage availability detection with fallback behavior
    - _Requirements: 11.1, 11.3, 11.4_
  
  - [ ]* 2.2 Write property tests for Storage Manager
    - **Property 34: Storage Key Namespace Correctness**
    - **Validates: Requirements 11.4**
    - **Property 35: Comprehensive Data Persistence**
    - **Validates: Requirements 11.1**

- [x] 3. Implement Theme Controller module
  - [ ] 3.1 Create ThemeController with theme switching logic
    - Implement `init()`, `toggle()`, `getCurrentTheme()`, and `applyTheme()` methods
    - Add/remove `dark-theme` class on body element
    - Integrate with StorageManager for theme persistence
    - Set default theme to 'light' if no preference exists
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 10.6_
  
  - [ ] 3.2 Add CSS theme variables and dark mode overrides
    - Define CSS custom properties for colors, spacing, typography
    - Create dark-theme class overrides for all color variables
    - Apply theme variables to all UI components
    - _Requirements: 10.3_
  
  - [ ]* 3.3 Write property tests for Theme Controller
    - **Property 31: Theme Toggle Correctness**
    - **Validates: Requirements 10.2**
    - **Property 32: Theme Application Correctness**
    - **Validates: Requirements 10.3**
    - **Property 33: Theme Persistence Round-Trip**
    - **Validates: Requirements 10.4, 10.5**

- [ ] 4. Checkpoint - Verify foundation modules
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Greeting Widget module
  - [ ] 5.1 Create GreetingWidget with time/date display
    - Implement `init()`, `updateTime()`, and `setUserName()` methods
    - Format current date as "Day-of-Week, Month Day, Year"
    - Format current time as HH:MM with zero-padding
    - Set up 60-second interval for time updates
    - Calculate time-based greeting prefix (morning/afternoon/evening)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 5.2 Add custom name input and persistence
    - Add name input field to greeting widget DOM
    - Implement debounced save (500ms delay) to StorageManager
    - Load persisted name on initialization
    - Update greeting message to include name when available
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 5.3 Write property tests for Greeting Widget
    - **Property 1: Date Formatting Correctness**
    - **Validates: Requirements 2.1**
    - **Property 2: Time Formatting Correctness**
    - **Validates: Requirements 2.2**
    - **Property 3: Time-Based Greeting Correctness**
    - **Validates: Requirements 2.3, 2.4, 2.5**
    - **Property 4: Name Persistence Round-Trip**
    - **Validates: Requirements 3.2, 3.4, 3.5**

- [ ] 6. Implement Timer Widget module
  - [ ] 6.1 Create TimerWidget with state machine
    - Implement `init()`, `start()`, `stop()`, `reset()`, and `setDuration()` methods
    - Create timer state machine (IDLE, RUNNING, PAUSED)
    - Implement 1-second countdown interval with MM:SS display format
    - Manage interval cleanup and state transitions
    - Add button state updates (enabled/disabled based on timer state)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_
  
  - [ ] 6.2 Add timer completion notification
    - Detect when countdown reaches 00:00
    - Trigger browser notification or alert
    - Auto-reset timer to idle state after completion
    - _Requirements: 4.6_
  
  - [ ] 6.3 Add custom duration configuration
    - Add duration input field (1-60 minutes)
    - Implement input validation with error display
    - Persist valid duration to StorageManager
    - Load persisted duration on initialization
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 6.4 Write property tests for Timer Widget
    - **Property 5: Timer Display Format Correctness**
    - **Validates: Requirements 4.1**
    - **Property 6: Timer Pause Preserves State**
    - **Validates: Requirements 4.3**
    - **Property 7: Timer Resume Continuity**
    - **Validates: Requirements 4.4**
    - **Property 8: Timer Reset Restoration**
    - **Validates: Requirements 4.5**
    - **Property 9: Timer Button State Consistency**
    - **Validates: Requirements 4.7**
    - **Property 10: Timer Duration Update Correctness**
    - **Validates: Requirements 5.2**
    - **Property 11: Timer Duration Validation**
    - **Validates: Requirements 5.3**
    - **Property 12: Timer Duration Persistence Round-Trip**
    - **Validates: Requirements 5.4, 5.5**

- [ ] 7. Checkpoint - Verify time-based widgets
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement Todo Widget module
  - [ ] 8.1 Create TodoWidget with task CRUD operations
    - Implement `init()`, `addTask()`, `toggleTask()`, `deleteTask()`, and `render()` methods
    - Generate unique task IDs using crypto.randomUUID() or timestamp fallback
    - Create task data model (id, description, completed, createdAt)
    - Implement task list rendering with checkboxes and action buttons
    - Persist task list changes to StorageManager
    - Load persisted tasks on initialization
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.8_
  
  - [ ] 8.2 Add task editing functionality
    - Implement `editTask()` method
    - Create edit mode UI with inline input field
    - Add save and cancel buttons for edit mode
    - Validate edited descriptions and persist changes
    - _Requirements: 6.6, 6.7_
  
  - [ ] 8.3 Add duplicate task prevention
    - Implement case-insensitive duplicate detection for add operation
    - Implement case-insensitive duplicate detection for edit operation
    - Display inline error messages for 3 seconds on duplicate detection
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 8.4 Add empty task validation
    - Validate non-empty, non-whitespace input on add
    - Validate non-empty, non-whitespace input on edit
    - Display inline error message for empty input
    - _Requirements: 6.3_
  
  - [ ]* 8.5 Write property tests for Todo Widget core operations
    - **Property 13: Task Addition Correctness**
    - **Validates: Requirements 6.2**
    - **Property 14: Empty Task Rejection**
    - **Validates: Requirements 6.3**
    - **Property 15: Task Completion Toggle**
    - **Validates: Requirements 6.4**
    - **Property 16: Task Deletion Correctness**
    - **Validates: Requirements 6.5**
    - **Property 17: Task Edit Correctness**
    - **Validates: Requirements 6.6, 6.7**
    - **Property 18: Task List Persistence Round-Trip**
    - **Validates: Requirements 6.8**
    - **Property 19: Duplicate Task Prevention (Add)**
    - **Validates: Requirements 7.1**
    - **Property 20: Duplicate Task Prevention (Edit)**
    - **Validates: Requirements 7.2, 7.3**

- [ ] 9. Implement Todo Widget sorting functionality
  - [ ] 9.1 Add task sorting with multiple sort orders
    - Implement `setSortOrder()` method
    - Add sort order dropdown UI (pending first, completed first, alphabetical)
    - Implement pending-first sort logic
    - Implement completed-first sort logic
    - Implement alphabetical (A-Z) case-insensitive sort logic
    - Re-apply sort after any task modification
    - Persist sort order preference to StorageManager
    - Load persisted sort order on initialization (default: pending first)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 9.2 Write property tests for Todo Widget sorting
    - **Property 21: Pending-First Sort Ordering**
    - **Validates: Requirements 8.2**
    - **Property 22: Completed-First Sort Ordering**
    - **Validates: Requirements 8.3**
    - **Property 23: Alphabetical Sort Ordering**
    - **Validates: Requirements 8.4**
    - **Property 24: Sort Stability on Modification**
    - **Validates: Requirements 8.5**
    - **Property 25: Sort Preference Persistence Round-Trip**
    - **Validates: Requirements 8.6**

- [ ] 10. Checkpoint - Verify Todo Widget
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement Links Widget module
  - [ ] 11.1 Create LinksWidget with link CRUD operations
    - Implement `init()`, `addLink()`, `deleteLink()`, `openLink()`, and `render()` methods
    - Generate unique link IDs using crypto.randomUUID() or timestamp fallback
    - Create link data model (id, label, url, createdAt)
    - Implement link list rendering with clickable buttons and delete controls
    - Persist link list changes to StorageManager
    - Load persisted links on initialization
    - _Requirements: 9.1, 9.2, 9.5, 9.6_
  
  - [ ] 11.2 Add URL normalization and validation
    - Implement URL normalization (prepend https:// if missing protocol)
    - Validate URL format after normalization
    - Implement link opening in new tab with noopener/noreferrer
    - _Requirements: 9.4, 9.7_
  
  - [ ] 11.3 Add empty field validation
    - Validate non-empty label input
    - Validate non-empty URL input
    - Display inline error message for empty fields
    - _Requirements: 9.3_
  
  - [ ]* 11.4 Write property tests for Links Widget
    - **Property 26: Link Addition Correctness**
    - **Validates: Requirements 9.2**
    - **Property 27: Empty Link Field Rejection**
    - **Validates: Requirements 9.3**
    - **Property 28: Link Deletion Correctness**
    - **Validates: Requirements 9.5**
    - **Property 29: Link List Persistence Round-Trip**
    - **Validates: Requirements 9.6**
    - **Property 30: URL Normalization**
    - **Validates: Requirements 9.7**

- [ ] 12. Implement App module and integration
  - [ ] 12.1 Create App initializer module
    - Implement `init()` method with module initialization sequence
    - Initialize StorageManager and check availability
    - Initialize ThemeController and apply persisted theme
    - Initialize all widgets in dependency order
    - Bind global event listeners (theme toggle)
    - Add DOM ready detection and bootstrap code
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [ ] 12.2 Add interval cleanup on page unload
    - Implement beforeunload event handler
    - Clean up greeting widget time interval
    - Clean up timer widget countdown interval
    - _Requirements: 12.4_
  
  - [ ]* 12.3 Write property test for complete state restoration
    - **Property 36: Complete State Restoration**
    - **Validates: Requirements 11.2**

- [ ] 13. Implement CSS styling and responsive layout
  - [ ] 13.1 Complete widget component styles
    - Style all widget containers with borders, padding, shadows
    - Style greeting widget (time, date, message, input)
    - Style timer widget (display, controls, config)
    - Style todo widget (input group, list items, checkboxes, actions)
    - Style links widget (input group, link buttons, delete buttons)
    - Apply consistent typography and spacing
    - _Requirements: 1.1_
  
  - [ ] 13.2 Implement responsive grid layout
    - Create CSS Grid layout for widget rows
    - Add responsive breakpoints (desktop, tablet, mobile)
    - Ensure single-column stack on mobile (<768px)
    - Ensure 2-column layout on tablet (768px-1200px)
    - Ensure 2x2 grid on desktop (>1200px)
    - _Requirements: 1.1_
  
  - [ ] 13.3 Style buttons and form elements
    - Create base button styles with transitions
    - Style primary, secondary, and icon button variants
    - Add hover and disabled states
    - Style form inputs (text, number, select)
    - Style error message displays
    - _Requirements: 1.1_

- [ ] 14. Final integration and testing
  - [ ] 14.1 Test complete user workflows
    - Verify dashboard loads and initializes all widgets
    - Test adding, editing, completing, deleting tasks
    - Test adding, deleting, opening links
    - Test theme toggle and persistence
    - Test custom name and timer duration persistence
    - Test all sort orders
    - Verify Local Storage persistence across page reloads
    - _Requirements: 1.1, 1.2, 1.3, 11.2_
  
  - [ ] 14.2 Test error handling and edge cases
    - Test empty input validation across all widgets
    - Test duplicate task prevention
    - Test invalid timer duration input
    - Test Local Storage unavailable scenario (private browsing)
    - Verify no uncaught JavaScript exceptions
    - _Requirements: 1.4, 11.3, 12.4_
  
  - [ ]* 14.3 Write integration tests
    - Test full app initialization sequence
    - Test persistence round-trip for all data types
    - Test widget independence (one widget failure doesn't affect others)

- [ ] 15. Final checkpoint - Complete feature validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements from requirements.md for traceability
- Property-based tests validate universal correctness properties defined in design.md
- Unit tests and integration tests validate specific examples and edge cases
- The implementation uses vanilla JavaScript with IIFE module pattern for browser compatibility
- All data persists to Local Storage under the "tld_" namespace prefix
- The dashboard is fully functional as a standalone file (file:// protocol)
- No external frameworks or backend APIs are used

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2"] },
    { "id": 3, "tasks": ["3.3", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1"] },
    { "id": 5, "tasks": ["5.3", "6.2"] },
    { "id": 6, "tasks": ["6.3", "8.1"] },
    { "id": 7, "tasks": ["6.4", "8.2"] },
    { "id": 8, "tasks": ["8.3", "8.4"] },
    { "id": 9, "tasks": ["8.5", "9.1"] },
    { "id": 10, "tasks": ["9.2", "11.1"] },
    { "id": 11, "tasks": ["11.2", "11.3"] },
    { "id": 12, "tasks": ["11.4", "12.1"] },
    { "id": 13, "tasks": ["12.2", "13.1"] },
    { "id": 14, "tasks": ["12.3", "13.2"] },
    { "id": 15, "tasks": ["13.3", "14.1"] },
    { "id": 16, "tasks": ["14.2"] },
    { "id": 17, "tasks": ["14.3"] }
  ]
}
```
