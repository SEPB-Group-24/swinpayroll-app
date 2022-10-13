import { Component } from 'react';
import { HashRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

import Auth from 'renderer/components/Auth';
import IndexPage from 'renderer/pages/IndexPage';
import LoginPage from 'renderer/pages/LoginPage';
import MasterPage from 'renderer/pages/MasterPage';
import PayrollHistoryPage from 'renderer/pages/PayrollHistoryPage';

import './App.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Auth>
          {({ authToken, fetchApi, onLogin, onLogout, user }) => {
            return (
              <>
                {user ? (
                  <Routes>
                    <Route path="/" element={<IndexPage onLogout={onLogout} />} />
                    <Route path="/master" element={<MasterPage fetchApi={fetchApi} />} />
                    <Route path="/payroll-history" element={<PayrollHistoryPage fetchApi={fetchApi} />} />
                  </Routes>
                ) : (
                  <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
                  </Routes>
                )}
              </>
            );
          }}
        </Auth>
      </Router>
    );
  }
}
