import React, { useState, useEffect } from 'react';
import { getDefaultVSCodeSettingsPath, readJsonFile, writeJsonFile, selectFile, fileExists } from '../utils/fileUtils';
import { useNotifications } from '../utils/notifications';

const VSCodeSettings: React.FC = () => {
  const [settingsPath, setSettingsPath] = useState('');
  const [settings, setSettings] = useState<any>({});
  const [rawJson, setRawJson] = useState('{}');
  const [isRawMode, setIsRawMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadDefaultPath();
  }, []);

  const loadDefaultPath = async () => {
    try {
      const defaultPath = await getDefaultVSCodeSettingsPath();
      setSettingsPath(defaultPath);
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to determine default path: ${error.message}`,
      });
    }
  };

  const handleLoadSettings = async () => {
    if (!settingsPath) {
      addNotification({
        type: 'warning',
        message: 'Please specify a settings file path',
      });
      return;
    }

    setIsLoading(true);
    try {
      const exists = await fileExists(settingsPath);
      if (!exists) {
        addNotification({
          type: 'warning',
          message: 'Settings file does not exist. Starting with empty settings.',
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
        message: 'Settings loaded successfully',
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
    if (!settingsPath) {
      addNotification({
        type: 'warning',
        message: 'Please specify a settings file path',
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

      await writeJsonFile(settingsPath, dataToSave);
      setSettings(dataToSave);
      setRawJson(JSON.stringify(dataToSave, null, 2));
      addNotification({
        type: 'success',
        message: 'Settings saved successfully',
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

  const handleBrowse = async () => {
    const selected = await selectFile([
      { name: 'JSON', extensions: ['json'] },
    ]);
    if (selected) {
      setSettingsPath(selected);
    }
  };

  const handleRawJsonChange = (value: string) => {
    setRawJson(value);
  };

  const toggleMode = () => {
    if (!isRawMode) {
      // Switching to raw mode
      setRawJson(JSON.stringify(settings, null, 2));
    } else {
      // Switching to form mode
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
        <h2>VS Code Settings</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Settings File Location</h3>
          </div>
          
          <div className="form-group">
            <label className="form-label">Settings Path</label>
            <div className="path-selector">
              <input
                type="text"
                className="form-input"
                value={settingsPath}
                onChange={(e) => setSettingsPath(e.target.value)}
                placeholder="Path to settings.json"
              />
              <button className="btn btn-secondary" onClick={handleBrowse}>
                Browse
              </button>
            </div>
            <span className="form-hint">
              Default: User settings.json location
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
                onChange={(e) => handleRawJsonChange(e.target.value)}
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
            <h3 className="card-title">Help</h3>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Click "Load Settings" to read your current VS Code settings</li>
            <li>Switch between Form View and Raw JSON mode for editing</li>
            <li>Edit the JSON directly in Raw JSON mode</li>
            <li>Click "Save Settings" to write changes to the file</li>
            <li>A backup is recommended before making changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VSCodeSettings;
