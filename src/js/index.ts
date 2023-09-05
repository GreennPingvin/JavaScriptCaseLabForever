import "../scss/index.scss";
import "../index.html";
import { data } from "../assets/data/todos.js";
import { loadData, saveData } from "./utils";

const TODOS_KEY = "TODOS";
const page = {
  addPanel: document.querySelector(".add-panel") as HTMLFormElement,
  main: {
    todos: document.querySelector(".todos"),
  },
};

interface Todo {
  id: number;
  content: string;
  finished: boolean;
}

let todos = loadData<Todo[]>(TODOS_KEY) || data;
console.log(todos);

function renderTodos(todos: Todo[]): void {
  page.main.todos.innerHTML = "";
  let count = 1;
  for (const todo of todos) {
    const todoElem = document.createElement("li");
    todoElem.classList.add("todos__item");
    todoElem.innerHTML = `
    <div class="todos__number">${count}</div>
    <div class="todos__text">${todo.content}</div>
    <button class="todos__remove-btn">
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24"
             xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6M4 6H20M10 10V16M14 10V16"
                  stroke="#94A3BD" stroke-linecap="round"
                  stroke-linejoin="round" stroke-width="1.5"/>
        </svg>
    </button>`;
    todoElem
      .querySelector(".todos__remove-btn")
      .addEventListener("click", () => {
        todos = todos.filter((item) => item.id !== todo.id);
        renderTodos(todos);
      });
    page.main.todos.appendChild(todoElem);
    count++;
  }
  saveData(TODOS_KEY, todos);
}

function addNewTodo(content: string): void {
  const id = todos.at(-1)?.id + 1 || 1;
  todos = [...todos, { id, content, finished: false }];
  renderTodos(todos);
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

/* init */
(function (): void {
  renderTodos(todos);
})();
