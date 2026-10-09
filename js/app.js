/**
 * Life Dashboard - Personal Productivity Hub (Simplified Timer - 25 min only)
 * A client-side single-page application with vanilla JavaScript
 * All data persists in browser Local Storage
 */

// ==========================================
// Storage Manager Module
// ==========================================
const StorageManager = (function() {
  const NAMESPACE = 'tld_';
  let storageAvailable = null;

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

  function init() {
    const savedTheme = StorageManager.get(THEME_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
    updateThemeIcon();
  }

  function applyTheme(theme) {
    currentTheme = theme;
    
    if (theme === 'dark') {
      document.body.classList.add(DARK_THEME_CLASS);
    } else {
      document.body.classList.remove(DARK_THEME_CLASS);
    }

    StorageManager.set(THEME_KEY, theme);
  }

  function toggle() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
  }

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

  function init(containerSelector) {
    currentUserName = StorageManager.get(NAME_KEY) || '';
    
    const nameInput = document.querySelector('#greeting-name-input');
    if (nameInput) {
      nameInput.value = currentUserName;
      nameInput.addEventListener('input', handleNameInput);
    }

    updateTime();
    updateGreeting();

    timeUpdateInterval = setInterval(updateTime, 60000);
  }

  function handleNameInput(e) {
    const name = e.target.value.trim();
    
    clearTimeout(nameInputTimeout);
    nameInputTimeout = setTimeout(() => {
      setUserName(name);
    }, 500);
  }

  function updateTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', options);
    
    const timeEl = document.querySelector('#greeting-time');
    const dateEl = document.querySelector('#greeting-date');
    
    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
    
    updateGreeting();
  }

  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    }
    
    const message = currentUserName 
      ? `${greeting}, ${currentUserName}!` 
      : `${greeting}!`;
    
    const messageEl = document.querySelector('#greeting-message');
    if (messageEl) {
      messageEl.textContent = message;
    }
  }

  function setUserName(name) {
    currentUserName = name;
    StorageManager.set(NAME_KEY, name);
    updateGreeting();
  }

  function cleanup() {
    if (timeUpdateInterval) {
      clearInterval(timeUpdateInterval);
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
// Timer Widget Module (FIXED 25 MINUTES)
// ==========================================
const TimerWidget = (function() {
  const STATES = {
    IDLE: 'idle',
    RUNNING: 'running',
    PAUSED: 'paused'
  };

  const FIXED_DURATION = 25 * 60; // 25 minutes in seconds

  let state = STATES.IDLE;
  let remainingTime = FIXED_DURATION;
  let intervalId = null;

  function init(containerSelector) {
    const startBtn = document.querySelector('#timer-start');
    const stopBtn = document.querySelector('#timer-stop');
    const resetBtn = document.querySelector('#timer-reset');

    if (startBtn) startBtn.addEventListener('click', start);
    if (stopBtn) stopBtn.addEventListener('click', stop);
    if (resetBtn) resetBtn.addEventListener('click', reset);

    updateDisplay();
    updateControls();
  }

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

  function stop() {
    if (state !== STATES.RUNNING) return;

    clearInterval(intervalId);
    intervalId = null;
    state = STATES.PAUSED;
    updateControls();
  }

  function reset() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    state = STATES.IDLE;
    remainingTime = FIXED_DURATION;
    updateDisplay();
    updateControls();
  }

  function complete() {
    clearInterval(intervalId);
    intervalId = null;
    state = STATES.IDLE;

    notifyComplete();
    reset();
  }

  function notifyComplete() {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Timer Complete!', {
        body: '25 minutes session finished. Great work!',
        icon: '✓'
      });
    }

    // Browser alert as fallback
    alert('🎉 Focus timer complete! Great work!');
  }

  function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const displayEl = document.querySelector('#timer-display');
    if (displayEl) {
      displayEl.textContent = display;
    }
  }

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

  function init(containerSelector) {
    tasks = StorageManager.get(TASKS_KEY) || [];
    currentSortOrder = StorageManager.get(SORT_KEY) || 'pending';

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

    const list = document.querySelector('#todo-list');
    if (list) {
      list.addEventListener('click', handleListClick);
    }

    render();
  }

  function handleAdd() {
    const input = document.querySelector('#todo-input');
    if (!input) return;

    const description = input.value.trim();
    if (!description) {
      showError('Task cannot be empty');
      return;
    }

    if (isDuplicate(description)) {
      showError('This task already exists');
      return;
    }

    const task = {
      id: generateId(),
      description: description,
      completed: false,
      createdAt: Date.now()
    };

    tasks.push(task);
    persistTasks();
    render();
    input.value = '';
    input.focus();
  }

  function isDuplicate(description) {
    return tasks.some(t => t.description.toLowerCase() === description.toLowerCase());
  }

  function handleListClick(e) {
    const taskItem = e.target.closest('.todo-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.taskId;

    if (e.target.matches('.todo-checkbox')) {
      toggleTask(taskId);
    } else if (e.target.matches('.todo-delete')) {
      deleteTask(taskId);
    }
  }

  function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      persistTasks();
      render();
    }
  }

  function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    persistTasks();
    render();
  }

  function setSortOrder(order) {
    currentSortOrder = order;
    StorageManager.set(SORT_KEY, order);
    render();
  }

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

  function render() {
    const list = document.querySelector('#todo-list');
    if (!list) return;

    const sortedTasks = getSortedTasks();

    list.innerHTML = sortedTasks.map(task => `
      <li class="todo-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" role="listitem">
        <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''} />
        <span class="todo-text">${escapeHtml(task.description)}</span>
        <div class="todo-actions">
          <button class="todo-delete btn-icon" title="Delete task">✕</button>
        </div>
      </li>
    `).join('');
  }

  function persistTasks() {
    StorageManager.set(TASKS_KEY, tasks);
  }

  function showError(message) {
    const errorEl = document.querySelector('#todo-error');
    if (errorEl) {
      errorEl.textContent = message;
      setTimeout(() => {
        errorEl.textContent = '';
      }, 3000);
    }
  }

  return {
    init
  };
})();

// ==========================================
// Links Widget Module
// ==========================================
const LinksWidget = (function() {
  const LINKS_KEY = 'links';
  
  let links = [];

  function init(containerSelector) {
    links = StorageManager.get(LINKS_KEY) || [];

    const addBtn = document.querySelector('#link-add');
    const labelInput = document.querySelector('#link-label');
    const urlInput = document.querySelector('#link-url');

    if (addBtn) addBtn.addEventListener('click', handleAdd);

    const container = document.querySelector('#links-container');
    if (container) {
      container.addEventListener('click', handleContainerClick);
    }

    render();
  }

  function handleAdd() {
    const labelInput = document.querySelector('#link-label');
    const urlInput = document.querySelector('#link-url');

    if (!labelInput || !urlInput) return;

    const label = labelInput.value.trim();
    const url = urlInput.value.trim();

    if (!label || !url) {
      showError('Both label and URL are required');
      return;
    }

    const normalizedUrl = normalizeUrl(url);

    const link = {
      id: generateId(),
      label: label,
      url: normalizedUrl,
      createdAt: Date.now()
    };

    links.push(link);
    persistLinks();
    render();
    labelInput.value = '';
    urlInput.value = '';
    labelInput.focus();
  }

  function handleContainerClick(e) {
    if (e.target.matches('.link-button')) {
      const linkItem = e.target.closest('.link-item');
      if (linkItem) {
        const url = linkItem.dataset.linkUrl;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else if (e.target.matches('.link-delete')) {
      const linkItem = e.target.closest('.link-item');
      if (linkItem) {
        const linkId = linkItem.dataset.linkId;
        deleteLink(linkId);
      }
    }
  }

  function deleteLink(linkId) {
    links = links.filter(l => l.id !== linkId);
    persistLinks();
    render();
  }

  function normalizeUrl(url) {
    url = url.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    return url;
  }

  function render() {
    const container = document.querySelector('#links-container');
    if (!container) return;

    if (links.length === 0) {
      container.innerHTML = '<p class="text-muted">No links yet</p>';
      return;
    }

    container.innerHTML = links.map(link => `
      <div class="link-item" data-link-id="${link.id}" data-link-url="${escapeHtml(link.url)}" role="listitem">
        <button class="link-button" title="Open ${escapeHtml(link.url)}">${escapeHtml(link.label)}</button>
        <button class="link-delete btn-icon" title="Delete">✕</button>
      </div>
    `).join('');
  }

  function persistLinks() {
    StorageManager.set(LINKS_KEY, links);
  }

  function showError(message) {
    const errorEl = document.querySelector('#link-error');
    if (errorEl) {
      errorEl.textContent = message;
      setTimeout(() => {
        errorEl.textContent = '';
      }, 3000);
    }
  }

  return {
    init
  };
})();

// ==========================================
// App Module (Initializer)
// ==========================================
const App = (function() {
  function init() {
    console.log('Initializing Life Dashboard...');

    if (StorageManager.isAvailable()) {
      console.log('Local Storage is available');
    } else {
      console.warn('Local Storage is not available - data will not persist');
    }

    ThemeController.init();

    GreetingWidget.init('#greeting-widget');
    TimerWidget.init('#timer-widget');
    TodoWidget.init('#todo-widget');
    LinksWidget.init('#links-widget');

    bindGlobalEvents();

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    console.log('Life Dashboard initialized successfully');
  }

  function bindGlobalEvents() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeController.toggle();
      });
    }

    window.addEventListener('beforeunload', cleanup);
  }

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

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ==========================================
// Bootstrap Application
// ==========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

