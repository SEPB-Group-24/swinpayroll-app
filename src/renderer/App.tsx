import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './Pages/LoginPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
