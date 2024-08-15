// selecao de elementos
const todoForm = document.querySelector('#todo-form')
const todoInput = document.querySelector('#todo-input')
const todoList = document.querySelector('#todo-list')
const editForm = document.querySelector('#edit-form')
let editInput = document.querySelector('#edit-input')
const cancelEditBtn = document.querySelector('#cancel-edit-btn')
const searchInput = document.querySelector('#search-input')
const eraseBtn = document.querySelector('#erase-button')
const filterBtn = document.querySelector('#filter-select')

let oldInputValue;
// funcoes
const saveTodo = (text, done=0, save=1) =>{
    // criar div
    const todo = document.createElement('div')
    todo.classList.add('todo')

    // insira h3
    const todoTitle = document.createElement('h3')
    todoTitle.innerHTML = text
    todo.appendChild(todoTitle)

    const doneBtn = document.createElement('button')
    doneBtn.classList.add('finish-todo')
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)

    const editBtn = document.createElement('button')
    editBtn.classList.add('edit-todo')
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)

    const remBtn = document.createElement('button')
    remBtn.classList.add('remove-todo')
    remBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(remBtn)

    // utilizando dados da localStorage
    if(done){
        todo.classList.add('done')
    }
    if(save){
        saveTodoLocalStorage({text, done: 0})
    }

    todoList.appendChild(todo)
    
    todoInput.value = ''
    todoInput.focus()   
}

const toggleForms = () =>{
    editForm.classList.toggle('hide')
    todoForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const updateTodo = (text) =>{
    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3')

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text

            updateTodoLocalStorage(oldInputValue, text)
        }
    }
)}

const getSearchTodos = (search) => {

    const todos = document.querySelectorAll('.todo')

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3').innerText.toLowerCase()

        const normalizedSearch = search.toLowerCase()

        todo.style.display = 'flex'

        if(!todoTitle.includes(normalizedSearch)) {
            todo.style.display = 'none'
        }
    })

}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll('.todo')

    switch(filterValue){
        case 'all':
            todos.forEach((todo) => (todo.style.display = 'flex'))
            break
        case 'done':
            todos.forEach((todo) => 
            todo.classList.contains('done') 
            ? todo.style.display = 'flex' 
            : todo.style.display = 'none')
            break
        case 'todo':
            todos.forEach((todo) => 
            !todo.classList.contains('done') 
            ? todo.style.display = 'flex' 
            : todo.style.display = 'none')
            break
        default:
            break
    }
}

// eventos
todoForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const todoValue = todoInput.value
    
    if(todoValue){
        saveTodo(todoValue)
    }
})

document.addEventListener('click', (e) => {
    
    const targetEl = e.target
    const parentEl = targetEl.closest('div')
    let todotitle;

    if(parentEl && parentEl.querySelector('h3')){
        todotitle = parentEl.querySelector('h3').innerText
    }

    // finish
    if(targetEl.classList.contains('finish-todo')){
        parentEl.classList.toggle('done')

        updateTodoStatusLocalStorage(todotitle)
    }
    // remove
    if(targetEl.classList.contains('remove-todo')){
        parentEl.remove()

        removeTodoLocalStorage(todotitle)
    }
    // edit
    if(targetEl.classList.contains('edit-todo')){
        toggleForms()
        editInput.value = todotitle
        oldInputValue = todotitle
    }
})

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault()
    toggleForms()
})

editForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const editInputValue = editInput.value
    
    if(editInputValue){
        updateTodo(editInputValue)
    }
    toggleForms()
})

searchInput.addEventListener('keyup', (e) =>{
    const search = e.target.value

    getSearchTodos(search)
})

eraseBtn.addEventListener('click', (e) =>{
    e.preventDefault()

    searchInput.value = ''

    searchInput.dispatchEvent(new Event('keyup'))
})

filterBtn.addEventListener('change', (e) =>{

    const filterValue = e.target.value;

    filterTodos(filterValue)
})

// local storage
const getTodosLocalStorage = () =>{
    const todos = JSON.parse(localStorage.getItem('todos')) || []

    return todos
}

const loadTodos = () => {
    const todos =  getTodosLocalStorage()

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}

const saveTodoLocalStorage = (todo) =>{
    // todos os todos da local storage
    const todos = getTodosLocalStorage()
    // add o novo todo no arr
    todos.push(todo)
    // salvar tudo na ls
    localStorage.setItem('todos', JSON.stringify(todos))
}

const removeTodoLocalStorage = (todoText) =>{

    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem('todos', JSON.stringify(filteredTodos))

}

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null) 

    localStorage.setItem('todos', JSON.stringify(todos))
}

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) =>
        todo.text === todoOldText ? (todo.text = todoNewText) : null
    )
    localStorage.setItem('todos', JSON.stringify(todos))
}

loadTodos()