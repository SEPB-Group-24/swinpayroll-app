import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import TabsComponent from './pages/TabsComponent';

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/tabs" element={<TabsComponent />} />
      </Routes>
    </Router>
  );
}
