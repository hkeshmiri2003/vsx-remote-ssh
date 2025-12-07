import React, { useState } from 'react';
import { writeFile, saveFileDialog } from '../utils/fileUtils';
import { useNotifications } from '../utils/notifications';
import { SSHConfig } from '../types';

const SSHConfigPage: React.FC = () => {
  const [config, setConfig] = useState<SSHConfig>({
    alias: '',
    hostname: '',
    port: 22,
    username: '',
    identityFile: '',
    forwardAgent: false,
    additionalOptions: '',
  });
  const [generatedConfig, setGeneratedConfig] = useState('');
  const { addNotification } = useNotifications();

  const handleGenerate = () => {
    if (!config.alias || !config.hostname || !config.username) {
      addNotification({
        type: 'warning',
        message: 'Alias, Hostname, and Username are required',
      });
      return;
    }

    let configText = `Host ${config.alias}\n`;
    configText += `    HostName ${config.hostname}\n`;
    configText += `    User ${config.username}\n`;
    configText += `    Port ${config.port}\n`;
    
    if (config.identityFile) {
      configText += `    IdentityFile ${config.identityFile}\n`;
    }
    
    if (config.forwardAgent) {
      configText += `    ForwardAgent yes\n`;
    }
    
    if (config.additionalOptions) {
      const options = config.additionalOptions.split('\n').filter(line => line.trim());
      options.forEach(option => {
        configText += `    ${option.trim()}\n`;
      });
    }

    setGeneratedConfig(configText);
    addNotification({
      type: 'success',
      message: 'SSH config snippet generated',
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedConfig);
      addNotification({
        type: 'success',
        message: 'Config copied to clipboard',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to copy to clipboard',
      });
    }
  };

  const handleSave = async () => {
    if (!generatedConfig) {
      addNotification({
        type: 'warning',
        message: 'Generate config first',
      });
      return;
    }

    const path = await saveFileDialog('ssh-config', [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] },
    ]);

    if (path) {
      try {
        await writeFile(path, generatedConfig);
        addNotification({
          type: 'success',
          message: 'Config saved successfully',
        });
      } catch (error: any) {
        addNotification({
          type: 'error',
          message: `Failed to save config: ${error.message}`,
        });
      }
    }
  };

  const handleReset = () => {
    setConfig({
      alias: '',
      hostname: '',
      port: 22,
      username: '',
      identityFile: '',
      forwardAgent: false,
      additionalOptions: '',
    });
    setGeneratedConfig('');
  };

  return (
    <div>
      <div className="content-header">
        <h2>SSH / Remote Helpers</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">SSH Connection Details</h3>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Host Alias *</label>
              <input
                type="text"
                className="form-input"
                value={config.alias}
                onChange={(e) => setConfig({ ...config, alias: e.target.value })}
                placeholder="my-server"
              />
              <span className="form-hint">Friendly name for this connection</span>
            </div>

            <div className="form-group">
              <label className="form-label">Hostname/IP *</label>
              <input
                type="text"
                className="form-input"
                value={config.hostname}
                onChange={(e) => setConfig({ ...config, hostname: e.target.value })}
                placeholder="192.168.1.100 or example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                className="form-input"
                value={config.username}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
                placeholder="ubuntu"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Port</label>
              <input
                type="number"
                className="form-input"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 22 })}
                placeholder="22"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Identity File (SSH Key)</label>
            <input
              type="text"
              className="form-input"
              value={config.identityFile}
              onChange={(e) => setConfig({ ...config, identityFile: e.target.value })}
              placeholder="~/.ssh/id_rsa"
            />
            <span className="form-hint">Path to your private SSH key</span>
          </div>

          <div className="form-group">
            <label className="flex" style={{ alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.forwardAgent}
                onChange={(e) => setConfig({ ...config, forwardAgent: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Forward SSH Agent
            </label>
            <span className="form-hint">Enable agent forwarding for git operations</span>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Options</label>
            <textarea
              className="form-textarea"
              value={config.additionalOptions}
              onChange={(e) => setConfig({ ...config, additionalOptions: e.target.value })}
              placeholder="ServerAliveInterval 60&#10;ServerAliveCountMax 3"
              style={{ minHeight: '100px', fontFamily: 'Consolas, Monaco, monospace' }}
            />
            <span className="form-hint">Additional SSH config options (one per line)</span>
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleGenerate}>
              ⚡ Generate Config
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {generatedConfig && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Generated SSH Config</h3>
            </div>
            
            <div className="form-group">
              <pre style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '16px',
                borderRadius: '4px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '13px',
                overflow: 'auto',
              }}>
                {generatedConfig}
              </pre>
            </div>

            <div className="btn-group">
              <button className="btn btn-secondary" onClick={handleCopy}>
                📋 Copy to Clipboard
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                💾 Save to File
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">How to Use</h3>
          </div>
          <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Fill in the SSH connection details above</li>
            <li>Click "Generate Config" to create the SSH config snippet</li>
            <li>Copy the generated config or save it to a file</li>
            <li>Append the config to your <code>~/.ssh/config</code> file</li>
            <li>Connect using: <code>ssh your-alias</code></li>
          </ol>

          <div className="mt-3">
            <p><strong>To append to SSH config:</strong></p>
            <pre style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: '12px',
              borderRadius: '4px',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '13px',
              marginTop: '8px'
            }}>
              {`# On Linux/macOS:
cat ssh-config >> ~/.ssh/config

# On Windows (PowerShell):
Get-Content ssh-config | Add-Content -Path $HOME\\.ssh\\config`}
            </pre>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Common Options</h3>
          </div>
          <p className="mb-2">Additional SSH config options you might want to add:</p>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontFamily: 'monospace' }}>
            <li><strong>ServerAliveInterval 60</strong> - Send keepalive every 60 seconds</li>
            <li><strong>ServerAliveCountMax 3</strong> - Max missed keepalives before disconnect</li>
            <li><strong>StrictHostKeyChecking no</strong> - Skip host key verification (use cautiously)</li>
            <li><strong>UserKnownHostsFile /dev/null</strong> - Don't save host keys (use cautiously)</li>
            <li><strong>LogLevel QUIET</strong> - Reduce SSH output verbosity</li>
            <li><strong>Compression yes</strong> - Enable SSH compression</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SSHConfigPage;
