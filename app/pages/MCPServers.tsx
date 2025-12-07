import React, { useState } from 'react';
import { readJsonFile, writeJsonFile, selectFile, fileExists } from '../utils/fileUtils';
import { useNotifications } from '../utils/notifications';
import { MCPConfig, MCPServer } from '../types';

const MCPServers: React.FC = () => {
  const [configPath, setConfigPath] = useState('');
  const [config, setConfig] = useState<MCPConfig>({ servers: {} });
  const [rawJson, setRawJson] = useState('{}');
  const [isRawMode, setIsRawMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingServer, setEditingServer] = useState<{ name: string; server: MCPServer } | null>(null);
  const { addNotification } = useNotifications();

  const handleBrowse = async () => {
    const selected = await selectFile([
      { name: 'JSON', extensions: ['json'] },
    ]);
    if (selected) {
      setConfigPath(selected);
    }
  };

  const handleLoad = async () => {
    if (!configPath) {
      addNotification({
        type: 'warning',
        message: 'Please specify a config file path',
      });
      return;
    }

    setIsLoading(true);
    try {
      const exists = await fileExists(configPath);
      if (!exists) {
        addNotification({
          type: 'warning',
          message: 'File does not exist. Starting with empty config.',
        });
        setConfig({ servers: {} });
        setRawJson(JSON.stringify({ servers: {} }, null, 2));
        return;
      }

      const loadedConfig = await readJsonFile(configPath);
      setConfig(loadedConfig);
      setRawJson(JSON.stringify(loadedConfig, null, 2));
      addNotification({
        type: 'success',
        message: 'MCP config loaded successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to load config: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!configPath) {
      addNotification({
        type: 'warning',
        message: 'Please specify a config file path',
      });
      return;
    }

    setIsLoading(true);
    try {
      let dataToSave = config;
      
      if (isRawMode) {
        try {
          dataToSave = JSON.parse(rawJson);
        } catch (error) {
          addNotification({
            type: 'error',
            message: 'Invalid JSON format',
          });
          setIsLoading(false);
          return;
        }
      }

      await writeJsonFile(configPath, dataToSave);
      setConfig(dataToSave);
      setRawJson(JSON.stringify(dataToSave, null, 2));
      addNotification({
        type: 'success',
        message: 'MCP config saved successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to save config: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddServer = () => {
    setEditingServer({
      name: '',
      server: {
        name: '',
        url: '',
        apiKey: '',
        enabled: true,
      },
    });
  };

  const handleEditServer = (name: string) => {
    setEditingServer({
      name,
      server: { ...config.servers[name], name },
    });
  };

  const handleDeleteServer = (name: string) => {
    const updated = { ...config };
    delete updated.servers[name];
    setConfig(updated);
    addNotification({
      type: 'success',
      message: 'Server deleted',
    });
  };

  const handleSaveServer = () => {
    if (!editingServer) return;

    const { name, server } = editingServer;
    if (!name || !server.url) {
      addNotification({
        type: 'warning',
        message: 'Name and URL are required',
      });
      return;
    }

    const updated = { ...config };
    updated.servers[name] = {
      name: server.name,
      url: server.url,
      apiKey: server.apiKey,
      enabled: server.enabled,
    };
    setConfig(updated);
    setEditingServer(null);
    addNotification({
      type: 'success',
      message: 'Server saved',
    });
  };

  const toggleMode = () => {
    if (!isRawMode) {
      setRawJson(JSON.stringify(config, null, 2));
    } else {
      try {
        const parsed = JSON.parse(rawJson);
        setConfig(parsed);
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Invalid JSON. Cannot switch to form mode.',
        });
        return;
      }
    }
    setIsRawMode(!isRawMode);
  };

  return (
    <div>
      <div className="content-header">
        <h2>MCP Servers</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Config File Location</h3>
          </div>
          
          <div className="form-group">
            <label className="form-label">MCP Config Path</label>
            <div className="path-selector">
              <input
                type="text"
                className="form-input"
                value={configPath}
                onChange={(e) => setConfigPath(e.target.value)}
                placeholder="Path to mcp.config.json"
              />
              <button className="btn btn-secondary" onClick={handleBrowse}>
                Browse
              </button>
            </div>
            <span className="form-hint">
              Typically: ~/.config/mcp/mcp.config.json
            </span>
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleLoad} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner" /> : '📂'} Load Config
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title">MCP Servers</h3>
            <div className="flex gap-2">
              {!isRawMode && (
                <button className="btn btn-primary" onClick={handleAddServer}>
                  + Add Server
                </button>
              )}
              <button className="btn btn-secondary" onClick={toggleMode}>
                {isRawMode ? '📝 Form View' : '📄 Raw JSON'}
              </button>
            </div>
          </div>

          {isRawMode ? (
            <div className="form-group">
              <textarea
                className="form-textarea json-editor-textarea"
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                placeholder='{"servers": {}}'
                spellCheck={false}
                style={{ minHeight: '300px', fontFamily: 'Consolas, Monaco, monospace' }}
              />
            </div>
          ) : (
            <div>
              {Object.keys(config.servers).length === 0 ? (
                <p className="text-muted">No servers configured. Click "Add Server" to get started.</p>
              ) : (
                <div>
                  {Object.entries(config.servers).map(([name, server]) => (
                    <div key={name} className="card" style={{ marginBottom: '12px' }}>
                      <div className="flex-between">
                        <div>
                          <strong>{name}</strong>
                          <p className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                            {server.url}
                          </p>
                          <p style={{ fontSize: '12px', marginTop: '4px' }}>
                            Status: {server.enabled ? <span style={{ color: 'var(--success-color)' }}>✓ Enabled</span> : <span style={{ color: 'var(--text-secondary)' }}>Disabled</span>}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button className="btn btn-secondary" onClick={() => handleEditServer(name)}>
                            Edit
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDeleteServer(name)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isRawMode && (
            <div className="btn-group mt-3">
              <button className="btn btn-success" onClick={handleSave} disabled={isLoading}>
                {isLoading ? <span className="loading-spinner" /> : '💾'} Save Config
              </button>
            </div>
          )}
        </div>

        {editingServer && (
          <div className="card" style={{ border: '2px solid var(--border-focus)' }}>
            <div className="card-header">
              <h3 className="card-title">
                {editingServer.name ? 'Edit Server' : 'Add Server'}
              </h3>
            </div>
            
            <div className="form-group">
              <label className="form-label">Server Name (ID)</label>
              <input
                type="text"
                className="form-input"
                value={editingServer.name}
                onChange={(e) => setEditingServer({ ...editingServer, name: e.target.value })}
                placeholder="my-server"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input
                type="text"
                className="form-input"
                value={editingServer.server.name}
                onChange={(e) => setEditingServer({
                  ...editingServer,
                  server: { ...editingServer.server, name: e.target.value }
                })}
                placeholder="My MCP Server"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Server URL</label>
              <input
                type="text"
                className="form-input"
                value={editingServer.server.url}
                onChange={(e) => setEditingServer({
                  ...editingServer,
                  server: { ...editingServer.server, url: e.target.value }
                })}
                placeholder="http://localhost:3000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">API Key (optional)</label>
              <input
                type="password"
                className="form-input"
                value={editingServer.server.apiKey || ''}
                onChange={(e) => setEditingServer({
                  ...editingServer,
                  server: { ...editingServer.server, apiKey: e.target.value }
                })}
                placeholder="your-api-key"
              />
            </div>

            <div className="form-group">
              <label className="flex" style={{ alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingServer.server.enabled}
                  onChange={(e) => setEditingServer({
                    ...editingServer,
                    server: { ...editingServer.server, enabled: e.target.checked }
                  })}
                  style={{ marginRight: '8px' }}
                />
                Enabled
              </label>
            </div>

            <div className="btn-group">
              <button className="btn btn-success" onClick={handleSaveServer}>
                Save Server
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingServer(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">About MCP Servers</h3>
          </div>
          <p style={{ lineHeight: '1.8' }}>
            MCP (Model Context Protocol) servers provide context and functionality to AI models.
            Configure your MCP servers here to integrate them with your development environment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MCPServers;
