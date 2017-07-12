import React from "react"
import { Link } from "react-router-dom"

export default class Header extends React.Component {
  render() {
    return (
      <nav role="navigation">
        <ul>
          <h1>secure todos</h1>
          <li><Link to="/">Todos</Link></li>
          <li><Link to="/login">Login/Logout</Link></li>
        </ul>
      </nav>
    )
  }
}