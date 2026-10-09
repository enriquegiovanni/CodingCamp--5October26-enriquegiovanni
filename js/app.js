/**
 * Life Dashboard - Personal Productivity Hub
 * A client-side single-page application with vanilla JavaScript
 * All data persists in browser Local Storage
 */

// ==========================================
// Storage Manager Module
// ==========================================
const StorageManager = (function() {
  const NAMESPACE = 'tld_';
  let storageAvailable = null;

  /**
   * Check if Local Storage is available
   * @returns {boolean}
   */
  function isAvailable() {
    if (storageAvailable !== null) {
      return storageAvailable;
    }

    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      storageAvailable = true;
      return true;
    } catch (e) {
      storageAvailable = false;
      console.warn('Local Storage is not available. Data will not persist.');
      return false;
    }
  }

  /**
   * Get a value from storage
   * @param {string} key - Storage key (without namespace prefix)
   * @returns {any|null}
   */
  function get(key) {
    if (!isAvailable()) return null;

    try {
      const item = localStorage.getItem(NAMESPACE + key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  }

  /**
   * Set a value in storage
   * @param {string} key - Storage key (without namespace prefix)
   * @param {any} value - Value to store (will be JSON serialized)
   * @returns {boolean} - Success status
   */
  function set(key, value) {
    if (!isAvailable()) return false;

    try {
      localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to storage:', e);
      return false;
    }
  }

  /**
   * Remove a value from storage
   * @param {string} key - Storage key (without namespace prefix)
   * @returns {boolean} - Success status
   */
  function remove(key) {
    if (!isAvailable()) return false;

    try {
      localStorage.removeItem(NAMESPACE + key);
      return true;
    } catch (e) {
      console.error('Error removing from storage:', e);
      return false;
    }
  }

  /**
   * Get all keys with namespace prefix
   * @returns {Object} - All namespaced data
   */
  function getAll() {
    if (!isAvailable()) return {};

    const data = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(NAMESPACE)) {
          const shortKey = key.substring(NAMESPACE.length);
          data[shortKey] = get(shortKey);
        }
      }
    } catch (e) {
      console.error('Error reading all from storage:', e);
    }
    return data;
  }

  return {
    get,
    set,
    remove,
    isAvailable,
    getAll
  };
})();

// ==========================================
// Theme Controller Module
// ==========================================
const ThemeController = (function() {
  const THEME_KEY = 'theme';
  const DARK_THEME_CLASS = 'dark-theme';
  const DEFAULT_THEME = 'light';

  let currentTheme = DEFAULT_THEME;

  /**
   * Initialize theme from storage or default
   */
  function init() {
    const savedTheme = StorageManager.get(THEME_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
    updateThemeIcon();
  }

  /**
   * Apply a specific theme
   * @param {string} theme - 'light' or 'dark'
   */
  function applyTheme(theme) {
    currentTheme = theme;
    
    if (theme === 'dark') {
      document.body.classList.add(DARK_THEME_CLASS);
    } else {
      document.body.classList.remove(DARK_THEME_CLASS);
    }

    StorageManager.set(THEME_KEY, theme);
  }

  /**
   * Toggle between light and dark themes
   */
  function toggle() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    updateThemeIcon();
  }

  /**
   * Update theme toggle button icon
   */
  function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
  }

  /**
   * Get current theme
   * @returns {string}
   */
  function getCurrentTheme() {
    return currentTheme;
  }

  return {
    init,
    toggle,
    getCurrentTheme,
    applyTheme
  };
})();

// ==========================================
// Greeting Widget Module
// ==========================================
const GreetingWidget = (function() {
  const NAME_KEY = 'userName';
  
  let currentUserName = '';
  let timeUpdateInterval = null;
  let nameInputTimeout = null;

  /**
   * Initialize the greeting widget
   * @param {string} containerSelector - CSS selector for widget container
   */
  function init(containerSelector) {
    // Load saved name
    currentUserName = StorageManager.get(NAME_KEY) || '';
    
    // Set up name input
    const nameInput = document.querySelector('#greeting-name-input');
    if (nameInput) {
      nameInput.value = currentUserName;
      nameInput.addEventListener('input', handleNameInput);
    }

    // Initial update
    updateTime();
    updateGreeting();

    // Update time every 60 seconds
    timeUpdateInterval = setInterval(updateTime, 60000);
  }

  /**
   * Handle name input with debouncing
   * @param {Event} e
   */
  function handleNameInput(e) {
    const name = e.target.value.trim();
    
    // Debounce the save operation
    clearTimeout(nameInputTimeout);
    nameInputTimeout = setTimeout(() => {
      setUserName(name);
    }, 500);
  }

  /**
   * Update the displayed time
   */
  function updateTime() {
    const now = new Date();
    
    // Format time (HH:MM)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    // Format date (Day-of-Week, Month Day, Year)
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Update DOM
    const timeEl = document.querySelector('#greeting-time');
    const dateEl = document.querySelector('#greeting-date');
    
    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
    
    // Update greeting message
    updateGreeting();
  }

  /**
   * Update greeting message based on time of day
   */
  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    }
    
    // Add name if available
    const message = currentUserName 
      ? `${greeting}, ${currentUserName}!` 
      : `${greeting}!`;
    
    const messageEl = document.querySelector('#greeting-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  }

  /**
   * Set/update user name
   * @param {string} name
   */
  function setUserName(name) {
    currentUserName = name;
    StorageManager.set(NAME_KEY, name);
    updateGreeting();
  }

  /**
   * Cleanup intervals
   */
  function cleanup() {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
    }
    if (nameInputTimeout) {
      clearTimeout(nameInputTimeout);
    }
  }

  return {
    init,
    updateTime,
    setUserName,
    cleanup
  };
})();

// ==========================================
// Timer Widget Module
// ==========================================
const TimerWidget = (function() {
  const DURATION_KEY = 'pomoDuration';
  const DEFAULT_DURATION = 25; // minutes
  
  const STATES = {
    IDLE: 'idle',
    RUNNING: 'running',
    PAUSED: 'paused'
  };

  let state = STATES.IDLE;
  let totalDuration = DEFAULT_DURATION * 60; // in seconds
  let remainingTime = totalDuration;
  let intervalId = null;

  /**
   * Initialize the timer widget
   * @param {string} containerSelector - CSS selector for widget container
   */
  function init(containerSelector) {
    // Load saved duration
    const savedDuration = StorageManager.get(DURATION_KEY);
    if (savedDuration) {
      totalDuration = savedDuration * 60;
      remainingTime = totalDuration;
    }

    // Update duration input
    const durationInput = document.querySelector('#timer-duration');
    if (durationInput) {
      durationInput.value = Math.floor(totalDuration / 60);
      durationInput.addEventListener('change', handleDurationChange);
    }

    // Bind button events
    const startBtn = document.querySelector('#timer-start');
    const stopBtn = document.querySelector('#timer-stop');
    const resetBtn = document.querySelector('#timer-reset');

    if (startBtn) startBtn.addEventListener('click', start);
    if (stopBtn) stopBtn.addEventListener('click', stop);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    // Initial display
    updateDisplay();
    updateControls();
  }

  /**
   * Handle duration input change
   * @param {Event} e
   */
  function handleDurationChange(e) {
    const minutes = parseInt(e.target.value, 10);
    const isValid = setDuration(minutes);
    
    if (!isValid) {
      // Reset input to current duration
      e.target.value = Math.floor(totalDuration / 60);
    }
  }

  /**
   * Start or resume the timer
   */
  function start() {
    if (state === STATES.RUNNING) return;

    state = STATES.RUNNING;
    updateControls();

    intervalId = setInterval(() => {
      remainingTime--;
      updateDisplay();

      if (remainingTime <= 0) {
        complete();
      }
    }, 1000);
  }

  /**
   * Pause the timer
   */
  function stop() {
    if (state !== STATES.RUNNING) return;

    clearInterval(intervalId);
    intervalId = null;
    state = STATES.PAUSED;
    updateControls();
  }

  /**
   * Reset the timer to full duration
   */
  function reset() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    state = STATES.IDLE;
    remainingTime = totalDuration;
    updateDisplay();
    updateControls();
    clearError();
  }

  /**
   * Handle timer completion
   */
  function complete() {
    clearInterval(intervalId);
    intervalId = null;
    state = STATES.IDLE;

    // Notify user
    notifyComplete();

    // Auto-reset
    reset();
  }

  /**
   * Show completion notification
   */
  function notifyComplete() {
    // Try browser notification first
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Timer Complete!', {
        body: 'Time to take a break.',
        icon: '⏰'
      });
    } else {
      // Fallback to alert
      alert('Focus Timer Complete! Time for a break.');
    }

    // Optional: Play sound (could add audio element)
  }

  /**
   * Set custom duration
   * @param {number} minutes
   * @returns {boolean} - Success status
   */
  function setDuration(minutes) {
    // Validate input
    if (isNaN(minutes) || minutes < 1 || minutes > 60) {
      showError('Duration must be between 1 and 60 minutes');
      return false;
    }

    // Only update if timer is idle
    if (state !== STATES.IDLE) {
      showError('Cannot change duration while timer is running');
      return false;
    }

    totalDuration = minutes * 60;
    remainingTime = totalDuration;
    StorageManager.set(DURATION_KEY, minutes);
    
    updateDisplay();
    clearError();
    return true;
  }

  /**
   * Update timer display
   */
  function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const displayEl = document.querySelector('#timer-display');
    if (displayEl) {
      displayEl.textContent = display;
    }
  }

  /**
   * Update button states
   */
  function updateControls() {
    const startBtn = document.querySelector('#timer-start');
    const stopBtn = document.querySelector('#timer-stop');

    if (startBtn) {
      startBtn.disabled = state === STATES.RUNNING;
    }
    if (stopBtn) {
      stopBtn.disabled = state !== STATES.RUNNING;
    }
  }

  /**
   * Show error message
   * @param {string} message
   */
  function showError(message) {
    const errorEl = document.querySelector('#timer-error');
    if (errorEl) {
      errorEl.textContent = message;
      setTimeout(clearError, 3000);
    }
  }

  /**
   * Clear error message
   */
  function clearError() {
    const errorEl = document.querySelector('#timer-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  /**
   * Cleanup intervals
   */
  function cleanup() {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  return {
    init,
    start,
    stop,
    reset,
    setDuration,
    cleanup
  };
})();

// ==========================================
// Todo Widget Module
// ==========================================
const TodoWidget = (function() {
  const TASKS_KEY = 'tasks';
  const SORT_KEY = 'sortOrder';
  
  let tasks = [];
  let currentSortOrder = 'pending';

  /**
   * Initialize the todo widget
   * @param {string} containerSelector - CSS selector for widget container
   */
  function init(containerSelector) {
    // Load saved tasks and sort order
    tasks = StorageManager.get(TASKS_KEY) || [];
    currentSortOrder = StorageManager.get(SORT_KEY) || 'pending';

    // Bind events
    const addBtn = document.querySelector('#todo-add');
    const input = document.querySelector('#todo-input');
    const sortSelect = document.querySelector('#todo-sort-select');

    if (addBtn) addBtn.addEventListener('click', handleAdd);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdd();
      });
    }
    if (sortSelect) {
      sortSelect.value = currentSortOrder;
      sortSelect.addEventListener('change', (e) => setSortOrder(e.target.value));
    }

    // Bind list events using delegation
    const list = document.querySelector('#todo-list');
    if (list) {
      list.addEventListener('click', handleListClick);
    }

    // Initial render
    render();
  }

  /**
   * Handle add button click
   */
  function handleAdd() {
    const input = document.querySelector('#todo-input');
    if (!input) return;

    const description = input.value.trim();
    if (addTask(description)) {
      input.value = '';
      clearError();
    }
  }

  /**
   * Handle list item clicks (event delegation)
   * @param {Event} e
   */
  function handleListClick(e) {
    const taskItem = e.target.closest('.todo-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.taskId;

    if (e.target.matches('.todo-checkbox')) {
      toggleTask(taskId);
    } else if (e.target.matches('.todo-delete')) {
      deleteTask(taskId);
    } else if (e.target.matches('.todo-edit')) {
      enterEditMode(taskId);
    } else if (e.target.matches('.todo-save')) {
      saveEdit(taskId);
    } else if (e.target.matches('.todo-cancel')) {
      exitEditMode(taskId);
    }
  }

  /**
   * Add a new task
   * @param {string} description
   * @returns {boolean} - Success status
   */
  function addTask(description) {
    // Validate empty input
    if (!description) {
      showError('Task description cannot be empty');
      return false;
    }

    // Check for duplicates (case-insensitive)
    const duplicate = tasks.find(
      task => task.description.toLowerCase() === description.toLowerCase()
    );
    if (duplicate) {
      showError('This task already exists in your list');
      return false;
    }

    // Create new task
    const task = {
      id: generateId(),
      description: description,
      completed: false,
      createdAt: Date.now()
    };

    tasks.push(task);
    persistTasks();
    render();
    return true;
  }

  /**
   * Toggle task completion status
   * @param {string} taskId
   */
  function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      persistTasks();
      render();
    }
  }

  /**
   * Delete a task
   * @param {string} taskId
   */
  function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    persistTasks();
    render();
  }

  /**
   * Enter edit mode for a task
   * @param {string} taskId
   */
  function enterEditMode(taskId) {
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskItem) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    taskItem.classList.add('todo-editing');
    taskItem.innerHTML = `
      <input type="text" class="todo-edit-input" value="${escapeHtml(task.description)}" />
      <div class="todo-actions">
        <button class="todo-save btn-icon" title="Save">✓</button>
        <button class="todo-cancel btn-icon" title="Cancel">✕</button>
      </div>
      <span class="error-message" role="alert"></span>
    `;

    const input = taskItem.querySelector('.todo-edit-input');
    if (input) {
      input.focus();
      input.select();
    }
  }

  /**
   * Save edited task
   * @param {string} taskId
   */
  function saveEdit(taskId) {
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskItem) return;

    const input = taskItem.querySelector('.todo-edit-input');
    if (!input) return;

    const newDescription = input.value.trim();
    
    if (editTask(taskId, newDescription)) {
      render();
    } else {
      // Show error in edit mode
      const errorEl = taskItem.querySelector('.error-message');
      if (errorEl && errorEl.textContent) {
        // Error is already displayed
      }
    }
  }

  /**
   * Edit task description
   * @param {string} taskId
   * @param {string} newDescription
   * @returns {boolean} - Success status
   */
  function editTask(taskId, newDescription) {
    // Validate empty input
    if (!newDescription) {
      showEditError(taskId, 'Task description cannot be empty');
      return false;
    }

    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Check for duplicates (case-insensitive, excluding current task)
    const duplicate = tasks.find(
      t => t.id !== taskId && 
           t.description.toLowerCase() === newDescription.toLowerCase()
    );
    if (duplicate) {
      showEditError(taskId, 'This task already exists in your list');
      return false;
    }

    task.description = newDescription;
    persistTasks();
    return true;
  }

  /**
   * Exit edit mode without saving
   * @param {string} taskId
   */
  function exitEditMode(taskId) {
    render();
  }

  /**
   * Set sort order
   * @param {string} order - 'pending', 'completed', or 'alpha'
   */
  function setSortOrder(order) {
    currentSortOrder = order;
    StorageManager.set(SORT_KEY, order);
    render();
  }

  /**
   * Render task list
   */
  function render() {
    const list = document.querySelector('#todo-list');
    if (!list) return;

    // Sort tasks
    const sortedTasks = getSortedTasks();

    // Render
    list.innerHTML = sortedTasks.map(task => `
      <li class="todo-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" role="listitem">
        <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} 
               aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}" />
        <span class="todo-text">${escapeHtml(task.description)}</span>
        <div class="todo-actions">
          <button class="todo-edit btn-icon" title="Edit task" aria-label="Edit task">✎</button>
          <button class="todo-delete btn-icon" title="Delete task" aria-label="Delete task">✕</button>
        </div>
      </li>
    `).join('');
  }

  /**
   * Get tasks sorted by current sort order
   * @returns {Array}
   */
  function getSortedTasks() {
    const sorted = [...tasks];

    switch (currentSortOrder) {
      case 'pending':
        return sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      
      case 'completed':
        return sorted.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? -1 : 1;
        });
      
      case 'alpha':
        return sorted.sort((a, b) => 
          a.description.toLowerCase().localeCompare(b.description.toLowerCase())
        );
      
      default:
        return sorted;
    }
  }

  /**
   * Persist tasks to storage
   */
  function persistTasks() {
    StorageManager.set(TASKS_KEY, tasks);
  }

  /**
   * Show error message
   * @param {string} message
   */
  function showError(message) {
    const errorEl = document.querySelector('#todo-error');
    if (errorEl) {
      errorEl.textContent = message;
      setTimeout(clearError, 3000);
    }
  }

  /**
   * Show error in edit mode
   * @param {string} taskId
   * @param {string} message
   */
  function showEditError(taskId, message) {
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskItem) return;

    const errorEl = taskItem.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = message;
      setTimeout(() => {
        errorEl.textContent = '';
      }, 3000);
    }
  }

  /**
   * Clear error message
   */
  function clearError() {
    const errorEl = document.querySelector('#todo-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  return {
    init,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    setSortOrder,
    render
  };
})();

// ==========================================
// Links Widget Module
// ==========================================
const LinksWidget = (function() {
  const LINKS_KEY = 'links';
  
  let links = [];

  /**
   * Initialize the links widget
   * @param {string} containerSelector - CSS selector for widget container
   */
  function init(containerSelector) {
    // Load saved links
    links = StorageManager.get(LINKS_KEY) || [];

    // Bind events
    const addBtn = document.querySelector('#link-add');
    const labelInput = document.querySelector('#link-label');
    const urlInput = document.querySelector('#link-url');

    if (addBtn) addBtn.addEventListener('click', handleAdd);
    if (labelInput) {
      labelInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdd();
      });
    }
    if (urlInput) {
      urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAdd();
      });
    }

    // Bind link container events using delegation
    const container = document.querySelector('#links-container');
    if (container) {
      container.addEventListener('click', handleLinkClick);
    }

    // Initial render
    render();
  }

  /**
   * Handle add button click
   */
  function handleAdd() {
    const labelInput = document.querySelector('#link-label');
    const urlInput = document.querySelector('#link-url');
    
    if (!labelInput || !urlInput) return;

    const label = labelInput.value.trim();
    const url = urlInput.value.trim();

    if (addLink(label, url)) {
      labelInput.value = '';
      urlInput.value = '';
      clearError();
    }
  }

  /**
   * Handle link container clicks (event delegation)
   * @param {Event} e
   */
  function handleLinkClick(e) {
    const linkItem = e.target.closest('.link-item');
    if (!linkItem) return;

    const linkId = linkItem.dataset.linkId;

    if (e.target.matches('.link-delete')) {
      e.stopPropagation();
      deleteLink(linkId);
    } else if (e.target.matches('.link-button')) {
      const link = links.find(l => l.id === linkId);
      if (link) openLink(link.url);
    }
  }

  /**
   * Add a new link
   * @param {string} label
   * @param {string} url
   * @returns {boolean} - Success status
   */
  function addLink(label, url) {
    // Validate empty fields
    if (!label || !url) {
      showError('Both label and URL are required');
      return false;
    }

    // Normalize URL
    const normalizedUrl = normalizeUrl(url);

    // Create new link
    const link = {
      id: generateId(),
      label: label,
      url: normalizedUrl,
      createdAt: Date.now()
    };

    links.push(link);
    persistLinks();
    render();
    return true;
  }

  /**
   * Delete a link
   * @param {string} linkId
   */
  function deleteLink(linkId) {
    links = links.filter(l => l.id !== linkId);
    persistLinks();
    render();
  }

  /**
   * Open a link in new tab
   * @param {string} url
   */
  function openLink(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Normalize URL (add https:// if missing protocol)
   * @param {string} url
   * @returns {string}
   */
  function normalizeUrl(url) {
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  /**
   * Render links list
   */
  function render() {
    const container = document.querySelector('#links-container');
    if (!container) return;

    if (links.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">No links yet. Add your favorite websites!</p>';
      return;
    }

    container.innerHTML = links.map(link => `
      <div class="link-item" data-link-id="${link.id}" role="listitem">
        <button class="link-button" title="Open ${escapeHtml(link.url)}">${escapeHtml(link.label)}</button>
        <button class="link-delete btn-icon" title="Delete link" aria-label="Delete ${escapeHtml(link.label)}">✕</button>
      </div>
    `).join('');
  }

  /**
   * Persist links to storage
   */
  function persistLinks() {
    StorageManager.set(LINKS_KEY, links);
  }

  /**
   * Show error message
   * @param {string} message
   */
  function showError(message) {
    const errorEl = document.querySelector('#link-error');
    if (errorEl) {
      errorEl.textContent = message;
      setTimeout(clearError, 3000);
    }
  }

  /**
   * Clear error message
   */
  function clearError() {
    const errorEl = document.querySelector('#link-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }

  return {
    init,
    addLink,
    deleteLink,
    openLink,
    render
  };
})();

// ==========================================
// App Module (Initializer)
// ==========================================
const App = (function() {
  /**
   * Initialize the entire application
   */
  function init() {
    console.log('Initializing Life Dashboard...');

    // Check storage availability
    if (StorageManager.isAvailable()) {
      console.log('Local Storage is available');
    } else {
      console.warn('Local Storage is not available - data will not persist');
    }

    // Initialize theme (must be first to prevent flash)
    ThemeController.init();

    // Initialize widgets
    GreetingWidget.init('#greeting-widget');
    TimerWidget.init('#timer-widget');
    TodoWidget.init('#todo-widget');
    LinksWidget.init('#links-widget');

    // Bind global events
    bindGlobalEvents();

    // Request notification permission for timer
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    console.log('Life Dashboard initialized successfully');
  }

  /**
   * Bind global event listeners
   */
  function bindGlobalEvents() {
    // Theme toggle button
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeController.toggle();
      });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
  }

  /**
   * Cleanup resources before page unload
   */
  function cleanup() {
    GreetingWidget.cleanup();
    TimerWidget.cleanup();
  }

  return {
    init
  };
})();

// ==========================================
// Utility Functions
// ==========================================

/**
 * Generate a unique ID
 * @returns {string}
 */
function generateId() {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback to timestamp-based ID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================
// Bootstrap Application
// ==========================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
