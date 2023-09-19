import "../scss/index.scss";
import "../index.html";
import "./themeSwitcher";
import { data } from "../assets/data/todos";
import { loadData, saveData } from "./utils";
import { Todo, TodoParity } from "./types";

/* Key for todos object in the local storage */
const TODOS_KEY = "TODOS";

/* Global object that stores the dom elements to work with */
const page = {
  addPanel: document.querySelector(".add-panel") as HTMLFormElement,
  main: {
    todoList: document.querySelector(".todos"),
    todos: null as NodeListOf<HTMLDivElement>,
  },
};

/* Getting todos */
let todos: Todo[] = loadData<Todo[]>(TODOS_KEY) || data;

/* Initial value for the further marking by parity */
let todoParity: TodoParity = null;

/* Rendering todos */
function renderTodos(): void {
  page.main.todoList.innerHTML = "";
  let count = 1;
  for (const todo of todos) {
    const todoElem = document.createElement("li");
    todoElem.classList.add("todos__item");
    todoElem.innerHTML = `
    <div class="todos__desc">
        <div class="todos__text" title="${todo.content}">${todo.content}</div>
    </div>
    <div class="todos__btns">
        <button class="btn ${
          todo.finished ? "btn--finished" : ""
        } todos__btn-finish">
            ${todo.finished ? "Завершена" : "Завершить"}
        </button>
        <button class="btn btn--remove todos__btn-remove">
            Удалить
        </button>
    </div>
`;
    todoElem
      .querySelector(".todos__btn-remove")
      .addEventListener("click", () => {
        todos = todos.filter((item) => item.id !== todo.id);
        render();
      });

    todoElem
      .querySelector(".todos__btn-finish")
      .addEventListener("click", () => {
        todo.finished = !todo.finished;
        const maxId = todos.reduce((a, b) => (a.id > b.id ? a : b)).id;
        todo.id = todo.id === maxId ? maxId : maxId + 1;
        render();
      });

    page.main.todoList.appendChild(todoElem);
    count++;
  }

  // write todos elements to the global object
  page.main.todos = document.querySelectorAll(".todos__item");
  process.env.NODE_ENV === "production" && saveData(TODOS_KEY, todos);
}

/* Creating a new todo and adding it to todos */
function addNewTodo(content: string): void {
  let id;
  if (todos.length === 0) {
    id = 1;
  } else {
    id = todos.reduce((a, b) => (a.id > b.id ? a : b)).id + 1;
  }

  todos = [...todos, { id, content, finished: false }];
}

/* Adding new todo */
page.addPanel.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);
  const todoContent = data.get("add-todo") as string;
  if (todoContent) {
    addNewTodo(todoContent);
    page.addPanel.reset();
    render();
  }
});

/* Marking todos by parity */
function markTodos(parity: TodoParity): void {
  if (parity === null) {
    return;
  }
  page.main.todos.forEach((todo: HTMLDivElement, i: number): void => {
    if (i % 2 === (parity === "odd" ? 0 : 1)) {
      todo.classList.add("todos__item--marked");
    } else {
      todo.classList.remove("todos__item--marked");
    }
    todoParity = parity;
  });
}

document.querySelector(".todo-buttons__odd").addEventListener("click", () => {
  markTodos("odd");
});
document.querySelector(".todo-buttons__even").addEventListener("click", () => {
  markTodos("even");
});

/* Removing the first todo */
function removeFirstTodo() {
  todos = todos.filter((todo, i) => i !== 0);
  render();
}

document
  .querySelector(".todo-buttons__remove-first")
  .addEventListener("click", () => {
    removeFirstTodo();
  });

/* Removing the last todo */
function removeLastTodo() {
  todos = todos.filter((todo, i, arr) => i !== arr.length - 1);
  render();
}

document
  .querySelector(".todo-buttons__remove-last")
  .addEventListener("click", () => {
    removeLastTodo();
  });

/* Sorting todos*/
function sortTodos(): void {
  const activeTodos: Todo[] = [];
  const finishedTodos: Todo[] = [];
  todos.forEach((todo) =>
    todo.finished ? finishedTodos.push(todo) : activeTodos.push(todo),
  );
  todos = [...activeTodos, ...finishedTodos.sort((a, b) => a.id - b.id)];
}

/* Updating progress */
function updateProgress(): void {
  const finishedTodos = todos.filter((todo) => todo.finished);
  const percent: number = +(
    (finishedTodos.length / todos.length) *
    100
  ).toFixed(0);
  const percentStr = isNaN(percent) ? "0" : percent.toString();
  document.querySelector(".progress__percent-text").innerHTML = percentStr;
  (
    document.querySelector(".progress__current") as HTMLDivElement
  ).style.width = `${percentStr}%`;
}

/* Rendering the app */
function render(): void {
  sortTodos();
  renderTodos();
  updateProgress();
  markTodos(todoParity);
}

/* init */
(function (): void {
  render();
})();
