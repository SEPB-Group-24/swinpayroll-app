import './style.css';
import logo from './logo.jpg';

const LoginPage = () => {
  return (
    <body>

      <div id="grid-header">
        <img src={logo} />
        <h1>Welcome to SwinPayroll</h1>
      </div>

      <div id="grid-body">
        <form>
          <h3>Sign In</h3>
          <label>Username</label>
          <br/>
          <input type="text" id="username"></input>
          <br/>
          <label>Password</label><br/>
          <input type="text" id="password"></input>
          <br/>
          <button type="submit" value="Submit">SIGN IN</button>
          <p>
            <a href="">Forgot Password?</a>
          </p>
          <hr/>
          <label>New User?</label>
          <br/>
          <button>SIGN UP</button>
        </form>
      </div>
      
    </body>
  );
};

export default LoginPage;