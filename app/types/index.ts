export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface VSCodeSettings {
  [key: string]: any;
}

export interface WorkspaceSettings {
  path: string;
  settings: VSCodeSettings;
}

export interface EnvVariable {
  key: string;
  value: string;
}

export interface MCPServer {
  name: string;
  url: string;
  apiKey?: string;
  enabled: boolean;
}

export interface MCPConfig {
  servers: {
    [key: string]: MCPServer;
  };
}

export interface SSHConfig {
  alias: string;
  hostname: string;
  port: number;
  username: string;
  identityFile?: string;
  forwardAgent?: boolean;
  additionalOptions?: string;
}

export interface Extension {
  id: string;
  name: string;
  version: string;
}

export interface BackupItem {
  name: string;
  timestamp: number;
  path: string;
  size: number;
}
