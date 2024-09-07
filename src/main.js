/* note: I encountered errors when trying to serve main.js after
it was created using echo "" > main.js. I fixed this by pasting
the content of the file into a new main.js file created using
my GUI. */
import "../style.css";

// Get the necessary DOM elements
const todoListElement = document.getElementById("todo-list");
const inputNewTodo = document.getElementById("new-todo");
const todoNav = document.getElementById("todo-nav");
const markAllCompleted = document.getElementById("mark-all-completed");
const clearCompleted = document.getElementById("clear-completed");
const activeTodosCount = document.getElementById("todo-count");

// Helper function to filter todos based on curr. filter setting
const filterTodos = (todos, filter) => {
  console.log(todos, filter)
  switch (filter) {
    case 'all': 
      return [...todos]; /* spread operator returns
      new awway of same elements in same order, promoting
      immutability. */
    case 'completed':
      return todos.filter((todo) => todo.completed);
    case 'active': 
      return todos.filter((todo) => !todo.completed);
  }
};

const markAllTodosCompleted = (todos) => {
  return todos.map((todo) => {
    return { ...todo, completed: true };
  });
};

const handleMarkAllTodosCompleted = () => {
  todoApp.markAllCompleted();
  renderTodos();
}

const deleteCompletedTodos = (todos) => {
  return todos.filter((todo) => !todo.completed);
};

const handleDeleteCompletedTodos = () => {
  todoApp.deleteCompleted();
  renderTodos();
}

// Factory functino to create a todo app
const createTodoApp = () => {
  // Define the state of our app
  let todos = [];
  let nextTodoId = 1;
  let filter = "all"; // all, active, or completed

  return {
    addTodo: (newTodoText) => {
      todos = addTodo(todos, newTodoText, nextTodoId++);
    },
    toggleTodo: (todoId) => {
      todos = toggleTodo(todos, todoId);
    },
    setFilter: (newFilter) => {
      filter = newFilter;
    },
    markAllCompleted: () => {
      todos = markAllTodosCompleted(todos);
    },
    deleteCompleted: () => {
      todos = deleteCompletedTodos(todos);
    },
    getNumberOfActiveTodos: () => {
      /* VERY IMPORTANT: when including parenthases, an arrow funciton will
      not implicitly return. */
      return todos.reduce((acc, todo) => acc + !todo.completed, 0)
    },
    getTodos: () => filterTodos(todos, filter),
  };
};

const todoApp = createTodoApp();

// Helper function to create text el. for a todo
const createTodoText = (todo) => {
  const todoText = document.createElement("div");
  todoText.id = `todo-text-${todo.id}`;
  console.log(todo.completed);
  todoText.classList.add(
    "todo-text",
    ...(todo.completed ? ["line-through"] : []), /* why pass
      arrays here rather than single strings? */
  );
  todoText.innerText = todo.text;
  return todoText;
};

// Helper function to create input el. for a todo
const createTodoEditInput = (todo) => {
  const todoEdit = document.createElement("input");
  todoEdit.classList.add("hidden", "todo-edit");
  todoEdit.value = todo.text;
  return todoEdit;
};

/* Helper function to create a todo item: a div containing 
text and input. */
const createTodoItem = (todo) => {
  const todoItem = document.createElement("div");
  todoItem.classList.add("p-4", "todo-item");
  todoItem.append(createTodoText(todo), createTodoEditInput(todo));
  return todoItem;
};

// Function to render todos
const renderTodos = () => {
  todoListElement.innerHTML = ""; // clear the current list

  const todoElements = todoApp.getTodos().map(createTodoItem);
  todoListElement.append(...todoElements);

  activeTodosCount.innerText = `${todoApp.getNumberOfActiveTodos()} item${todoApp.getNumberOfActiveTodos() === 1 ? "" : "s"} left`;
};

/* Helper functino to create a new arr. with the existing todos
and a new todo item.
Implicitly returns the same array that was passed, plus
an el. with the new todo text. */
const addTodo = (todos, newTodoText, newTodoId) => [
  ...todos,
  { id: newTodoId++, text: newTodoText, completed: false},
];

// Function to handle adding a new todo
const handleKeyDownToCreateNewTodo = (event) => {
  if (event.key === 'Enter') {
    console.log('entered')
    const todoText = event.target.value.trim();
    if (todoText) {
      todoApp.addTodo(todoText);
      event.target.value = ""; // clear the input
      renderTodos();
    }
  }
};

// Helper function to update the class list of a navbar el.
const updateClassList = (element, isActive) => {
  const classes = [
    "underline",
    "underline-offset-4",
    "decoration-rose-800",
    "decoration-2"
  ];
  if (isActive) {
    element.classList.add(...classes);
  } else{
    element.classList.remove(...classes);
  }
};

// Helper function to render the navbar anchor els.
const renderTodoNavBar = (href) => {
  Array.from(todoNav.children).forEach((element) => {
    updateClassList(element, element.href === href);
  });
};

// Event handler to filter the todos based on the navbar selection
const handleClickOnNavbar = (event) => {
  // if the clicked el. is an anchor tag:
  if (event.target.tagName === "A") {
    const hrefValue = event.target.href;
    todoApp.setFilter(hrefValue.split("/").pop() || "all");
    renderTodoNavBar(hrefValue);
    renderTodos();
  }
}

// Helper function to toggle the completed status of a todo item
const toggleTodo = (todos, todoId) => {
  return todos.map((todo) =>
    todo.id === todoId ? { ...todo, completed: !todo.completed }: todo,
  )
};

// Helper function to find the target todo element
const findTargetTodoElement = (event) => {
  return event.target.id?.includes("todo-text") ? event.target : null;
};

// Helper function to parse the todo id from the todo el.
const parseTodoId = (todo) => (todo ? Number(todo.id.split("-").pop()) : -1);

// Event handler to toggle the completed status of a todo item
const handleClickOnTodoList = (event) => {
  todoApp.toggleTodo(parseTodoId(findTargetTodoElement(event)));
  renderTodos();
};

// Add the event listeners
todoListElement.addEventListener("click", handleClickOnTodoList);
inputNewTodo.addEventListener("keydown", handleKeyDownToCreateNewTodo);
todoNav.addEventListener("click", handleClickOnNavbar);
markAllCompleted.addEventListener("click", handleMarkAllTodosCompleted);
clearCompleted.addEventListener("click", handleDeleteCompletedTodos);
document.addEventListener("DOMContentLoaded", renderTodos);