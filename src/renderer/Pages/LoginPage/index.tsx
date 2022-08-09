import './style.css';
import logo from './logo.jpg';

const LoginPage = () => {
  return (
    <body>

      <div id="grid-header">
        <img src={logo} />
        <div className="heading-main" id="heading-loginpage">
          Welcome to SwinPayroll
        </div>
      </div>

      <div id="grid-body">
        <form>
          <div className="heading-sub">
            Sign In
          </div>

          <div>
            <label htmlFor="username">Username</label>
          </div>

          <div>
            <input type="text" id="username"></input>
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
          </div>
          
          <div>
            <input type="text" id="password"></input>
          </div>
          
          <div>
            <button type="submit" value="Submit">SIGN IN</button>
          </div>

          <div>
            <a href="">Forgot Password?</a>
          </div>

          <hr/>

          <div>
            <label>New User?</label>
          </div>

          <div>
            <button>SIGN UP</button>
          </div>
        </form>
      </div>
    </body>
  );
};

export default LoginPage;