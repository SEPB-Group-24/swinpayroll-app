import { Link } from 'react-router-dom';

export default function IndexPage() {
  return (
    <div className="IndexPage">
      <Link to="/login">Login</Link>
    </div>
  );
};