import { Link } from 'react-router-dom';
import { OnLogout } from 'renderer/components/Auth';
import logo from './logo.jpg';
import './style.scss';

interface Props {
  onLogout: OnLogout;
}

export default function IndexPage() {
  return (
    <div className="IndexPage">
      <div className="header">
        <div className="logoContainer">
          <img src={logo} />
        </div>
        <div className="headingMain">
          Welcome to SwinPayroll
        </div>
      </div>
      <div className="body">
        <div className="master">
          <Link to="/master"><button>Master</button></Link>
        </div>
        <div className="masterDetail">
          <Link to="/"><button>Master-Detail</button></Link>
        </div>
        <div className="logout">
          <Link to="/"><button>Log Out</button></Link>
        </div>
      </div>
    </div>
  );
};
