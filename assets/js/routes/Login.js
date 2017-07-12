import React from "react"
import { computed } from "mobx"
import { observer } from "mobx-react"
import TodoStore from "../components/TodoStore"

// TODO this is tied to the DOM right now...
export function fbInit(appId) {
  FB.init({
    appId: appId,
    cookie: false,  // enable cookies to allow the server to access the session
    xfbml: false,  // parse social plugins on this page
    version: 'v2.9' // use graph api version 2.8
  });
}

@observer
export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
    this.checkLoginStatus()

  }

  fbLogin() {
    FB.login(this.checkLoginStatus.bind(this), {
      scope: "public_profile,email",
      return_scopes: true,
    })
  };

  fbLogout() {
    FB.logout( response => {
      // TODO very optimistic about the response above...
      this.store.user.name = ""
      this.store.user.key = ""
      this.store.loaded = false
    })
  }

  checkLoginStatus() {
    FB.getLoginStatus(this.statusChangeCallback.bind(this));
  }

  updateCredentials() {
    // this seems fine - only the api_key (app id) goes away visible.
    // app secret, access_token, etc seems safe. ish.
    // NOTE we can't POST this path, so some info goes into HTTP request URL
    FB.api('/me?fields=name,email', response => {
      if (this.store.user.name !== response.name) {
        // TODO use something that masks the user input
        const key = prompt("Enter your crypt key. We will not store this key for you! If you forget this key you won't be able to access your todos !!")
        this.store.user.key = key
        this.store.user.name = response.name
        if (!this.store.validKey()) {
          this.fbLogout()
          alert("Bad key!") // TODO or a problem with name - fix this
        }
      }
    });
  };

  statusChangeCallback(response) {
    if (response.status === 'connected') {
      this.updateCredentials()
    } else {
      this.store.user.name = ""
      this.store.user.key = ""
    }
  }

  render() {
    return (
      <div>
        { this.store.user.name ? <h2>Welcome {this.store.user.name}</h2> : <h2>Login</h2> }
        { !this.store.user.name ? <button onClick={this.fbLogin.bind(this)}>FB Login</button> : <button onClick={this.fbLogout.bind(this)}>Logout</button> }

      </div>
    )
  }
}
