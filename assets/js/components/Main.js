import React from "react"
import { Route, Switch } from "react-router-dom"
import TodoList from "../routes/TodoList"
import Login from "../routes/Login"
import TodoStore from "./TodoStore"

// window.store = TodoStore

export default class Main extends React.Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" render={(props) => <TodoList {...props} store={TodoStore}/>}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </main>
    )
  }
}
