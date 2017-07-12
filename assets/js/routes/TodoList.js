import React from "react"
import { observer } from "mobx-react"

@observer
export default class TodoList extends React.Component {
  createNew(e) {
    if (e.which === 13) {
      this.props.store.createTodo(e.target.value)
      e.target.value = ""
    }
  }

  render() {
    const store = this.props.store
    const todos = (
      <div>
       <input onKeyPress={this.createNew.bind(this)}/>
        <ul>
          { store.todos.map(
            (todo, idx) => <TodoView todo={todo} key={idx}/>
          ) }
        </ul>
      </div>
    )
    return (
      <div>
        <h2>Todos</h2>
        { store.userStoreId ? todos : <div>Please Login first</div>}
      </div>
    )
  }
}

@observer
class TodoView extends React.Component {
  toggleComplete() {
    this.props.todo.toggleComplete()
  }

  render() {
    const todo = this.props.todo
    return (
      <li>
        <input type="checkbox" onChange={this.toggleComplete.bind(this)} value={todo.complete} checked={todo.complete}/>
        <span>{todo.task}</span>
      </li>
    )
  }
}