import { computed, observable, autorun } from "mobx"

class Todo {
  task
  created
  @observable complete

  constructor(task) {
    this.task = task
    this.created = Date.now()
    this.complete = false
  }

  toggleComplete() {
    this.complete = !this.complete
  }

  get repr() {
    return `todo: ${this.task} - ${this.complete ? 'completed' : 'not completed'} (${this.created})`
  }
}

export class TodoStore {
  @observable todos = []

  constructor() {
    this.loadLocalStorage()
    autorun(() => {
      console.log(this.repr)
      this.saveLocalStorage()
    })
  }

  @computed get repr() {
    if (this.todos.length === 0) {
      return "<empty>"
    }
    return `${this.todos.length} total todos. Last: ${this.todos[this.todos.length - 1].repr}`
  }

  loadLocalStorage() {
    if (localStorage.reactMobxOauth_todos) {
      this.todos = JSON.parse(localStorage.reactMobxOauth_todos)
    } else {
      localStorage.reactMobxOauth_todos = "[]"
    }
  }

  saveLocalStorage() {
    localStorage.reactMobxOauth_todos = JSON.stringify(this.todos)
  }
  createTodo(task) {
    this.todos.push(new Todo(task))
  }
}

export default new TodoStore