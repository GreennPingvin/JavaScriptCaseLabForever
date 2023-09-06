import "../scss/index.scss";
import "../index.html";
import { data } from "../assets/data/todos";
import { loadData, saveData } from "./utils";
import { Todo, TodoParity } from "./types";

const TODOS_KEY = "TODOS";
const page = {
  addPanel: document.querySelector(".add-panel") as HTMLFormElement,
  main: {
    todoList: document.querySelector(".todos"),
    todos: null as NodeListOf<HTMLDivElement>,
  },
};

let todos: Todo[] = loadData<Todo[]>(TODOS_KEY) || data;
let todoParity: TodoParity = null;

function renderTodos(): void {
  page.main.todoList.innerHTML = "";
  let count = 1;
  for (const todo of todos) {
    const todoElem = document.createElement("li");
    todoElem.classList.add("todos__item");
    todoElem.innerHTML = `
    <div class="todos__number">${count}</div>
    <div class="todos__text">${todo.content}</div>
    <button class="btn-primary todos__complete-btn">
        Завершить
    </button>
    <button class="btn-primary todos__remove-btn">
        Удалить
    </button>
`;
    todoElem
      .querySelector(".todos__remove-btn")
      .addEventListener("click", () => {
        todos = todos.filter((item) => item.id !== todo.id);
        render();
      });
    page.main.todoList.appendChild(todoElem);
    count++;
  }
  page.main.todos = document.querySelectorAll(".todos__item");
  saveData(TODOS_KEY, todos);
}

function addNewTodo(content: string): void {
  const id = todos.at(-1)?.id + 1 || 1;
  todos = [...todos, { id, content, finished: false }];
  render();
}

page.addPanel.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const data = new FormData(event.target as HTMLFormElement);
  const todoContent = data.get("add-todo") as string;
  if (todoContent) {
    addNewTodo(todoContent);
    page.addPanel.reset();
  }
});

function markTodos(parity: TodoParity): void {
  if (parity === null) {
    return;
  }
  page.main.todos.forEach((todo: HTMLDivElement, i: number): void => {
    if (i % 2 === (parity === "odd" ? 1 : 0)) {
      todo.classList.add("todos__item--active");
    } else {
      todo.classList.remove("todos__item--active");
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

function removeFirstTodo() {
  todos = todos.filter((todo, i) => i !== 0);
  render();
}

document
  .querySelector(".todo-buttons__remove-first")
  .addEventListener("click", () => {
    removeFirstTodo();
  });

function removeLastTodo() {
  todos = todos.filter((todo, i, arr) => i !== arr.length - 1);
  render();
}

document
  .querySelector(".todo-buttons__remove-last")
  .addEventListener("click", () => {
    removeLastTodo();
  });

function render(): void {
  renderTodos();
  markTodos(todoParity);
}

/* init */
(function (): void {
  render();
})();
