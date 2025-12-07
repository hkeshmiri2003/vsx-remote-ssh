import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/vscode-settings', label: 'VS Code Settings', icon: '⚙️' },
  { path: '/workspace-settings', label: 'Workspace Settings', icon: '📁' },
  { path: '/api-keys', label: 'AI & API Keys', icon: '🔑' },
  { path: '/extensions', label: 'Extensions & Scripts', icon: '🔌' },
  { path: '/mcp-servers', label: 'MCP Servers', icon: '🖥️' },
  { path: '/ssh-config', label: 'SSH / Remote Helpers', icon: '🔐' },
  { path: '/backup-restore', label: 'Backup & Restore', icon: '💾' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>VSCode Super Config Manager</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
