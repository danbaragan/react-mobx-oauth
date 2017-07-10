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
    return `todo: ${this.task} - ${this.complete ? 'completed' : 'not completed'} (${this.id})`
  }
}

export class TodoStore {
  @observable todos = []

  constructor() {
    autorun(() => console.log(this.repr))
  }

  @computed get repr() {
    if (this.todos.length === 0) {
      return "<empty>"
    }
    return `${this.todos.length} total todos. Last: ${this.todos[this.todos.length - 1].repr}`
  }

  createTodo(task) {
    this.todos.push(new Todo(task))
  }
}

export default new TodoStore