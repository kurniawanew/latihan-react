import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
  withRouter
} from "react-router-dom";

const AuthApp = () => (
  <Router>
    <div>
      <Switch>
        <Redirect exact from="/" to="/login" />
        <Route path="/login" component={Login} />
      </Switch>
      <Route path="/register" component={Register} />
      <PrivateRoute path="/home" component={Home} />
    </div>
  </Router>
);

const Auth = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  authenticate(cb) {
    var emailLogin = document.getElementById('login-email').value;
    var passwordLogin = document.getElementById('login-password').value;
    fetch("https://reqres.in/api/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailLogin,
        password: passwordLogin
      })
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(!result.error) {
          this.isAuthenticated = true;
          localStorage.setItem('token', result.token);
          localStorage.setItem('email', emailLogin);
          window.location = "/home";
      } else {
          alert(result.error);
        }
      },
      (error) => {
        alert(error);
      }
    );
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const User = {
  new(cb) {
    var fullnameRegister = document.getElementById('register-fullname').value;
    var emailregister = document.getElementById('register-email').value;
    var passwordRegister = document.getElementById('register-password').value;
    fetch("https://reqres.in/api/users", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: fullnameRegister,
        email: emailregister,
        password: passwordRegister
      })      
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(!result.error) {
          window.location = "/login";
        } else {
          alert(result.error);
        }
      }
    );
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class Register extends React.Component {
  register = () => {
    User.new(() => {
      
    });
  };

  render() {
    return (
      <div id="register">
        <div id="registerForm">
          <div className="form">
            <input type="text" placeholder="Fullname" id="register-fullname" />
          </div>
          <div className="form">
            <input type="email" placeholder="Email" id="register-email" />
          </div>
          <div className="form">
            <input type="password" placeholder="Password" id="register-password" />
          </div>
          <div className="form">
            <button type="button" className="button btn-register" onClick={this.register}>REGISTER</button>
          </div>

          <div className="form login-link">
            <Link to="/login">Already registered! Login Me.</Link>
          </div>
        </div>
      </div>
    );
  }
}

const Home = () => <h3>selamat datang {localStorage.getItem('email')}</h3>;

class Login extends React.Component {
  state = {
    redirectToReferrer: Auth.isAuthenticated
  };

  login = () => {
    Auth.authenticate(() => {
      if(this.isAuthenticated) {
        this.setState({ redirectToReferrer: true });
      }
    });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/home" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div id="login">
        <div id="loginForm">
          <div className="form">
            <input type="email" placeholder="Email" id="login-email" />
          </div>
          <div className="form">
            <input type="password" placeholder="Password" id="login-password" />
          </div>
          <div className="form">
            <button type="button" className="button btn-login" onClick={this.login}>LOGIN</button>
          </div>

          <div className="form register-link">
            <Link to="/register">Not a member? Sign up now.</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthApp;