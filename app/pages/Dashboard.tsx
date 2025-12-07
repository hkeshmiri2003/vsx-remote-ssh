import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="content-header">
        <h2>Dashboard</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Welcome to VSCode Super Config Manager</h3>
          </div>
          <p className="text-muted mb-3">
            Manage your VS Code configurations, workspace settings, API keys, extensions, and more from one central location.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="flex" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <Link to="/vscode-settings" className="btn btn-primary">
              ⚙️ Manage VS Code Settings
            </Link>
            <Link to="/workspace-settings" className="btn btn-primary">
              📁 Configure Workspace
            </Link>
            <Link to="/api-keys" className="btn btn-primary">
              🔑 Manage API Keys
            </Link>
            <Link to="/backup-restore" className="btn btn-success">
              💾 Create Backup
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Features</h3>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>✅ Manage global VS Code settings</li>
            <li>✅ Configure workspace-specific settings</li>
            <li>✅ Securely store API keys and environment variables</li>
            <li>✅ Generate extension installation scripts</li>
            <li>✅ Configure MCP servers</li>
            <li>✅ Generate SSH configuration snippets</li>
            <li>✅ Backup and restore all configurations</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Getting Started</h3>
          </div>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Navigate to <strong>VS Code Settings</strong> to manage your global settings</li>
            <li>Use <strong>Workspace Settings</strong> to configure project-specific options</li>
            <li>Store your API keys securely in <strong>AI & API Keys</strong></li>
            <li>Generate extension installation scripts in <strong>Extensions & Scripts</strong></li>
            <li>Configure MCP servers in <strong>MCP Servers</strong></li>
            <li>Create SSH configs in <strong>SSH / Remote Helpers</strong></li>
            <li>Create regular backups using <strong>Backup & Restore</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
