import { computed, observable, autorun, observe } from "mobx"
import CryptoJS from "crypto-js"

window.cry = CryptoJS

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
    // TODO make a setter here. We need to test the key for validity
    key: "",
  }
  // TODO use this better. The app should be locked when store not loaded
  // currently it is a mess
  loaded = false

  constructor() {
    observe(this.user, change => this.loadLocalStorage())
    autorun(() => {
      // TODO Put a propper redux in place. This is a hack based on repr touching all the fields we are interested in
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

  // depends on observable user.name. Only called if name changes
  @computed get userStoreId() {
    if (!this.user.name) {
      return ""
    }
    const sha = CryptoJS.SHA1(this.user.name)
    return `reactMobxOauth_${sha.toString(CryptoJS.enc.Hex).slice(0,8)}`
  }

  _decryptLocalStorage(encryptedSerializedTodos) {
    try {
      const decryptedSerializedTodos = CryptoJS.AES.decrypt(encryptedSerializedTodos, this.user.key)
      const serializedTodos = decryptedSerializedTodos.toString(CryptoJS.enc.Utf8)
      return serializedTodos
    } catch (e) {
      return ""
    }

  }

  // TODO valid OR logged user... these cries for a refactor
  validKey() {
    if (!this.userStoreId) {
      return false
    }
    const encryptedSerializedTodos = localStorage.getItem(this.userStoreId)
    if (!encryptedSerializedTodos) {
      // new user
      return true
    }
    const dec = this._decryptLocalStorage(encryptedSerializedTodos)

    return !!dec
  }

  loadLocalStorage() {
    if (!this.userStoreId) {
      return
    }
    const encryptedSerializedTodos = localStorage.getItem(this.userStoreId)

    // fresh start
    if (!encryptedSerializedTodos) {
      this.loaded = true
      console.log("New user. Take pass as granted")
      return
    }

    const serializedTodos = this._decryptLocalStorage(encryptedSerializedTodos)
    if (serializedTodos) {
      this.todos = JSON.parse(serializedTodos).map( todo_obj => new Todo(todo_obj))
      this.loaded = true
    } else {
      this.todos = []
      console.log("Bad passkey!")
    }
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