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
    // FB.getLoginStatus(this.statusChangeCallback.bind(this));
    this.checkLoginStatus()

  }

  fbLogin() {
    console.log(" +++++ fb_login")
    FB.login(this.checkLoginStatus.bind(this), {
      scope: "public_profile,email",
      return_scopes: true,
    })
  };

  fbLogout() {
    FB.logout( response => {
      // TODO what-if response...
      this.store.user = ""
      this.store.key = ""
    })
  }

  checkLoginStatus() {
    FB.getLoginStatus(this.statusChangeCallback.bind(this));
  }

  updateCredentials() {
    console.log('Welcome!  Fetching your information.... ');
    // this seems fine - only the api_key (app id) goes away visible.
    // app secret, access_token, etc seems safe. ish.
    // NOTE we can't POST this path, so some info goes into HTTP request URL
    FB.api('/me?fields=name,email', response => {
      console.log(response)
      console.log('Successful login for: ' + response.name);
      this.store.user = response.name
    });
  };

  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      this.updateCredentials()
    } else {
      this.store.user = ""
    }
  }

  render() {
    return (
      <div>
        { this.store.user ? <h2>Welcome {this.store.user}</h2> : <h2>Login</h2> }
        { !this.store.user ? <button onClick={this.fbLogin.bind(this)}>FB Login</button> : <button onClick={this.fbLogout.bind(this)}>Logout</button> }

      </div>
    )
  }
}
