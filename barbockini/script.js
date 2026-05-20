const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const columns = document.querySelectorAll(".column");
const taskCount = document.getElementById("taskCount");
const notification = document.getElementById("notification");
const filter = document.getElementById("filter");

let tasks = JSON.parse(localStorage.getItem("barboskinTasks")) || [];

function saveTasks() {
  localStorage.setItem("barboskinTasks", JSON.stringify(tasks));
}

function showNotification(message) {
  notification.textContent = message;
  setTimeout(() => notification.textContent = "", 2000);
}

function updateCount() {
  taskCount.textContent = "Задач: " + tasks.length;
}

function renderTasks() {
  document.querySelectorAll(".task-list").forEach(list => list.innerHTML = "");

  tasks.forEach(task => {
    if (filter.value !== "all" && !task.text.includes(filter.value)) return;
    const div = document.createElement("div");
    div.className = "task";
    div.draggable = true;
    div.id = task.id;
    div.textContent = task.text;
    div.addEventListener("dragstart", e => {
      div.classList.add("dragging");
      e.dataTransfer.setData("text/plain", task.id);
    });
    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Изменить";
    editBtn.onclick = () => {
      const newText = prompt("Редактировать задачу:", task.text);
      if (newText) {
        task.text = newText;
        saveTasks();
        renderTasks();
      }
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
      showNotification("Задача удалена");
    };

    div.appendChild(document.createElement("br"));
    div.appendChild(editBtn);
    div.appendChild(delBtn);

    document
      .querySelector(`[data-status="${task.status}"] .task-list`)
      .appendChild(div);
  });
  updateCount();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const newTask = {
    id: Date.now().toString(),
    text: input.value,
    status: "todo"
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  input.value = "";
  showNotification("Задача добавлена");
});

columns.forEach(column => {
  column.addEventListener("dragover", e => {
    e.preventDefault();
    column.classList.add("drag-over");
  });
  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });
  column.addEventListener("drop", e => {
    e.preventDefault();
    column.classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    const task = tasks.find(t => t.id === id);
    task.status = column.dataset.status;
    saveTasks();
    renderTasks();
    showNotification("Статус задачи изменен");
  });
});

filter.addEventListener("change", renderTasks);
renderTasks();
