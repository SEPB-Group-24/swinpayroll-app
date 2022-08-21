import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div className="IndexPage">
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
       <Link to="/master">Master</Link>
      </div>
    </div>
  );
};
