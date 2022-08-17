import { Component, FormEvent } from 'react';

import fetchApi from 'utils/fetchApi';

import logo from './logo.jpg';

import './style.css';

interface Props {}

interface State {
  email: string;
  inFlight: boolean;
  password: string;
}

export default class LoginPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      inFlight: false,
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event: FormEvent) {
    event.preventDefault();

    this.setState({
      inFlight: true
    });

    try {
      const { email, password } = this.state;
      const user = await fetchApi('POST', 'auth/log_in', {
        email,
        password
      });
      console.log('logged in', user);
    } catch (error) {
      console.error('error while logging in', {
          error
      });
    } finally {
      this.setState({
        inFlight: false
      });
    }
  }

  render() {
    const { inFlight } = this.state;
    return (
      <div className="LoginPage">
        <div className="header">
          <div className="logoContainer">
            <img src={logo} />
          </div>
          <div className="headingMain">
            Welcome to SwinPayroll
          </div>
        </div>

        <div className="body">
          <form onSubmit={this.handleSubmit}>
            <div className="headingSub">
              Sign In
            </div>

            <div>
              <label htmlFor="email">Email</label>
            </div>

            <div>
              <input type="text" id="email" onChange={(event) => this.setState({ email: event.target.value })} />
            </div>

            <div>
              <label htmlFor="password">Password</label>
            </div>

            <div>
              <input type="password" id="password" onChange={(event) => this.setState({ password: event.target.value })} />
            </div>

            <div>
              <button disabled={inFlight} type="submit">SIGN IN</button>
            </div>

            <div>
              <a href="">Forgot Password?</a>
            </div>

            <hr/>

            <div>
              New User?
            </div>

            <div>
              <button disabled={inFlight}>SIGN UP</button>
            </div>
          </form>
        </div>


      </div>
    );
  }
}
