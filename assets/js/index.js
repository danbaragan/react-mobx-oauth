import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import Layout from "./routes/Layout"
import config from "./config.json"
import { fbInit } from "./routes/Login"

fbInit(config.appId)

const app = document.getElementById("app");

ReactDOM.render((
  <BrowserRouter>
    <Layout/>
  </BrowserRouter>
), app);
