// 待辦清單應用程式：使用原生 JavaScript 實作，資料儲存於 localStorage
(function () {
  const STORAGE_KEY = "todo-list-items";
  const THEME_STORAGE_KEY = "todo-list-theme";
  const FILTER_STORAGE_KEY = "todo-list-filter";

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const emptyMessage = document.getElementById("empty-message");
  const remainingCount = document.getElementById("remaining-count");
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleIcon = document.getElementById("theme-toggle-icon");
  const themeToggleText = document.getElementById("theme-toggle-text");
  const filterRow = document.getElementById("filter-row");

  // 篩選狀態文字對應的提示訊息(明確告知使用者資料只是被篩選掉,不是被刪除)
  const EMPTY_MESSAGES = {
    all: "還沒有任何待辦事項,新增一個吧!",
    active: "目前沒有未完成的待辦事項(其他項目並未消失,切換到「全部」即可查看)",
    completed: "目前沒有已完成的待辦事項(其他項目並未消失,切換到「全部」即可查看)",
  };

  let currentFilter = "all";

  // 從 localStorage 讀取資料，讀取失敗時回傳空陣列
  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  // 將目前的待辦事項寫回 localStorage
  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  let todos = loadTodos();

  // 套用主題並更新切換按鈕上的圖示與文字
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggleIcon.textContent = "☀️";
      themeToggleText.textContent = "淺色模式";
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggleIcon.textContent = "🌙";
      themeToggleText.textContent = "深色模式";
    }
  }

  // 初始化主題：優先採用使用者手動設定，否則跟隨作業系統偏好
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      applyTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });

  // 依篩選值切換選中按鈕的樣式
  function applyFilterButtonStyle(filter) {
    Array.from(filterRow.children).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });
  }

  // 初始化篩選條件：從 localStorage 讀取上次選擇，值不合法時安全回退成「全部」
  function initFilter() {
    const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
    if (savedFilter === "all" || savedFilter === "active" || savedFilter === "completed") {
      currentFilter = savedFilter;
    } else {
      currentFilter = "all";
    }
    applyFilterButtonStyle(currentFilter);
  }

  // 依目前篩選條件切換選中按鈕的樣式，並將選擇存進 localStorage
  filterRow.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) {
      return;
    }

    currentFilter = button.dataset.filter;
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
    applyFilterButtonStyle(currentFilter);
    render();
  });

  // 依目前篩選條件回傳要顯示的待辦事項
  function getFilteredTodos() {
    if (currentFilter === "active") {
      return todos.filter((todo) => !todo.completed);
    }
    if (currentFilter === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  }

  // 依照目前的 todos 陣列重新渲染整個清單
  function render() {
    list.innerHTML = "";

    const filteredTodos = getFilteredTodos();

    // 篩選後清單為空時，顯示對應的提示文字
    emptyMessage.style.display = filteredTodos.length === 0 ? "block" : "none";
    emptyMessage.textContent = EMPTY_MESSAGES[currentFilter];

    filteredTodos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "刪除";
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

    // 未完成筆數永遠以整體資料計算，不受篩選影響
    const remaining = todos.filter((todo) => !todo.completed).length;
    remainingCount.textContent = `未完成:${remaining} 項`;
  }

  // 新增一筆待辦事項
  function addTodo(text) {
    todos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text,
      completed: false,
    });
    saveTodos(todos);
    render();
  }

  // 切換完成狀態
  function toggleTodo(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(todos);
    render();
  }

  // 刪除指定待辦事項
  function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos(todos);
    render();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();

    // 輸入空白內容時不新增
    if (text === "") {
      return;
    }

    addTodo(text);
    input.value = "";
    input.focus();
  });

  initTheme();
  initFilter();
  render();
})();
