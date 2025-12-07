import React, { useState } from 'react';
import { readJsonFile, writeJsonFile, selectDirectory, fileExists } from '../utils/fileUtils';
import { useNotifications } from '../utils/notifications';

const WorkspaceSettings: React.FC = () => {
  const [workspacePath, setWorkspacePath] = useState('');
  const [settings, setSettings] = useState<any>({});
  const [rawJson, setRawJson] = useState('{}');
  const [isRawMode, setIsRawMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const getSettingsPath = (wsPath: string): string => {
    return `${wsPath}/.vscode/settings.json`;
  };

  const handleBrowseWorkspace = async () => {
    const selected = await selectDirectory();
    if (selected) {
      setWorkspacePath(selected);
    }
  };

  const handleLoadSettings = async () => {
    if (!workspacePath) {
      addNotification({
        type: 'warning',
        message: 'Please select a workspace folder',
      });
      return;
    }

    setIsLoading(true);
    try {
      const settingsPath = getSettingsPath(workspacePath);
      const exists = await fileExists(settingsPath);
      
      if (!exists) {
        addNotification({
          type: 'warning',
          message: 'No .vscode/settings.json found. Starting with empty settings.',
        });
        setSettings({});
        setRawJson('{}');
        return;
      }

      const loadedSettings = await readJsonFile(settingsPath);
      setSettings(loadedSettings);
      setRawJson(JSON.stringify(loadedSettings, null, 2));
      addNotification({
        type: 'success',
        message: 'Workspace settings loaded successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to load settings: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!workspacePath) {
      addNotification({
        type: 'warning',
        message: 'Please select a workspace folder',
      });
      return;
    }

    setIsLoading(true);
    try {
      let dataToSave = settings;
      
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

      const settingsPath = getSettingsPath(workspacePath);
      await writeJsonFile(settingsPath, dataToSave);
      setSettings(dataToSave);
      setRawJson(JSON.stringify(dataToSave, null, 2));
      addNotification({
        type: 'success',
        message: 'Workspace settings saved successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to save settings: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    if (!isRawMode) {
      setRawJson(JSON.stringify(settings, null, 2));
    } else {
      try {
        const parsed = JSON.parse(rawJson);
        setSettings(parsed);
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
        <h2>Workspace Settings</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Workspace Location</h3>
          </div>
          
          <div className="form-group">
            <label className="form-label">Workspace Folder</label>
            <div className="path-selector">
              <input
                type="text"
                className="form-input"
                value={workspacePath}
                onChange={(e) => setWorkspacePath(e.target.value)}
                placeholder="Select workspace folder"
              />
              <button className="btn btn-secondary" onClick={handleBrowseWorkspace}>
                Browse
              </button>
            </div>
            <span className="form-hint">
              Settings will be saved to: {workspacePath ? `${workspacePath}/.vscode/settings.json` : 'Not selected'}
            </span>
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleLoadSettings} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner" /> : '📂'} Load Settings
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title">Settings Editor</h3>
            <button className="btn btn-secondary" onClick={toggleMode}>
              {isRawMode ? '📝 Form View' : '📄 Raw JSON'}
            </button>
          </div>

          {isRawMode ? (
            <div className="form-group">
              <textarea
                className="form-textarea json-editor-textarea"
                value={rawJson}
                onChange={(e) => setRawJson(e.target.value)}
                placeholder="Paste or edit JSON here..."
                spellCheck={false}
                style={{ minHeight: '400px', fontFamily: 'Consolas, Monaco, monospace' }}
              />
            </div>
          ) : (
            <div>
              <p className="text-muted mb-2">
                Switch to Raw JSON mode to edit settings directly.
              </p>
              <div className="form-group">
                <pre style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  padding: '16px', 
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflow: 'auto',
                  fontSize: '13px',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}>
                  {JSON.stringify(settings, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="btn-group">
            <button className="btn btn-success" onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner" /> : '💾'} Save Settings
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">About Workspace Settings</h3>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Workspace settings override global VS Code settings</li>
            <li>Settings are stored in <code>.vscode/settings.json</code> in your workspace</li>
            <li>These settings are specific to the selected workspace/project</li>
            <li>Useful for project-specific configurations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
