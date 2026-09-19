// 待辦清單應用程式：使用原生 JavaScript 實作，資料儲存於 localStorage
(function () {
  const STORAGE_KEY = "todo-list-items";

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const emptyMessage = document.getElementById("empty-message");
  const remainingCount = document.getElementById("remaining-count");

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

  // 依照目前的 todos 陣列重新渲染整個清單
  function render() {
    list.innerHTML = "";

    // 清單為空時顯示提示文字，否則隱藏
    emptyMessage.style.display = todos.length === 0 ? "block" : "none";

    todos.forEach((todo) => {
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

  render();
})();
