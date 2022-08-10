import './style.css';
import logo from './logo.jpg';

const LoginPage = () => {
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
        <form>
          <div className="headingSub">
            Sign In
          </div>

          <div>
            <label htmlFor="username">Username</label>
          </div>

          <div>
            <input type="text" id="username" />
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
          </div>
          
          <div>
            <input type="text" id="password" />
          </div>
          
          <div>
            <button type="submit">SIGN IN</button>
          </div>

          <div>
            <a href="">Forgot Password?</a>
          </div>

          <hr/>

          <div>
            New User?
          </div>

          <div>
            <button>SIGN UP</button>
          </div>
        </form>
      </div>


    </div>
  );
};

export default LoginPage;
