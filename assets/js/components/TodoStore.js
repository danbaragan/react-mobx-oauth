import { computed, observable, autorun, observe } from "mobx"
import CryptoJS from "crypto-js"


class Todo {
  task
  created
  @observable complete

  // default arguments are evaluated late, at function execution and only if no value is provided by caller
  constructor({ task, created=Date.now(), complete=false }) {
    this.task = task
    this.created = created
    this.complete = complete
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
  @observable user = {
    name: "",
    // TODO how safe is this stored here?
    key: "",
  }
  loaded = false

  constructor() {
    observe(this.user, change => this.loadLocalStorage())
    autorun(() => {
      // console.log(this.repr)
      this.saveLocalStorage()
    })
  }

  @computed get repr() {
    if (this.todos.length === 0) {
      return "<empty>"
    }
    return `${this.todos.length} total todos. Last: ${this.todos[this.todos.length - 1].repr}`
  }

  // depends on observable user.name. Only called if name changes
  @computed get userStoreId() {
    if (!this.user.name) {
      return ""
    }
    const sha = CryptoJS.SHA1(this.user.name)
    return `reactMobxOauth_${sha.toString(CryptoJS.enc.Hex).slice(0,8)}`
  }

  loadLocalStorage() {
    if (!this.userStoreId) {
      return
    }
    const encryptedSerializedTodos = localStorage.getItem(this.userStoreId)
    let serializedTodos = "[]"
    if (encryptedSerializedTodos) {
      const decryptedSerializedTodos = CryptoJS.AES.decrypt(encryptedSerializedTodos, this.user.key)
      serializedTodos = decryptedSerializedTodos.toString(CryptoJS.enc.Utf8)
    }
    this.todos = JSON.parse(serializedTodos).map( todo_obj => new Todo(todo_obj))
    this.loaded = true
  }

  saveLocalStorage() {
    if (!this.userStoreId || !this.loaded) {
      return
    }
    const serializedTodos = JSON.stringify(this.todos)
    const encryptedSerializedTods = CryptoJS.AES.encrypt(serializedTodos, this.user.key)
    localStorage.setItem(this.userStoreId, encryptedSerializedTods)
  }
  createTodo(task) {
    this.todos.push(new Todo({task}))
  }
}

export default new TodoStore