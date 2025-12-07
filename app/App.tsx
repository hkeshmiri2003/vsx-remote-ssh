import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VSCodeSettings from './pages/VSCodeSettings';
import WorkspaceSettings from './pages/WorkspaceSettings';
import APIKeys from './pages/APIKeys';
import Extensions from './pages/Extensions';
import MCPServers from './pages/MCPServers';
import SSHConfigPage from './pages/SSHConfig';
import BackupRestore from './pages/BackupRestore';
import { NotificationProvider } from './utils/notifications';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vscode-settings" element={<VSCodeSettings />} />
              <Route path="/workspace-settings" element={<WorkspaceSettings />} />
              <Route path="/api-keys" element={<APIKeys />} />
              <Route path="/extensions" element={<Extensions />} />
              <Route path="/mcp-servers" element={<MCPServers />} />
              <Route path="/ssh-config" element={<SSHConfigPage />} />
              <Route path="/backup-restore" element={<BackupRestore />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NotificationProvider>
  );
};

export default App;
