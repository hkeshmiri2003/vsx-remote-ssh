import React, { useState } from 'react';
import { readFile, writeFile, selectFile, fileExists } from '../utils/fileUtils';
import { useNotifications } from '../utils/notifications';
import { EnvVariable } from '../types';

const APIKeys: React.FC = () => {
  const [envPath, setEnvPath] = useState('');
  const [envVars, setEnvVars] = useState<EnvVariable[]>([]);
  const [rawContent, setRawContent] = useState('');
  const [isRawMode, setIsRawMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const { addNotification } = useNotifications();

  const handleBrowse = async () => {
    const selected = await selectFile([
      { name: 'Environment Files', extensions: ['env', 'local'] },
      { name: 'All Files', extensions: ['*'] },
    ]);
    if (selected) {
      setEnvPath(selected);
    }
  };

  const parseEnvContent = (content: string): EnvVariable[] => {
    const lines = content.split('\n');
    const vars: EnvVariable[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const equalIndex = trimmed.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim();
          const value = trimmed.substring(equalIndex + 1).trim();
          vars.push({ key, value });
        }
      }
    });

    return vars;
  };

  const serializeEnvVars = (vars: EnvVariable[]): string => {
    return vars.map((v) => `${v.key}=${v.value}`).join('\n');
  };

  const handleLoad = async () => {
    if (!envPath) {
      addNotification({
        type: 'warning',
        message: 'Please specify an environment file path',
      });
      return;
    }

    setIsLoading(true);
    try {
      const exists = await fileExists(envPath);
      if (!exists) {
        addNotification({
          type: 'warning',
          message: 'File does not exist. Starting with empty content.',
        });
        setEnvVars([]);
        setRawContent('');
        return;
      }

      const content = await readFile(envPath);
      setRawContent(content);
      const parsed = parseEnvContent(content);
      setEnvVars(parsed);
      addNotification({
        type: 'success',
        message: 'Environment file loaded successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to load file: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!envPath) {
      addNotification({
        type: 'warning',
        message: 'Please specify an environment file path',
      });
      return;
    }

    setIsLoading(true);
    try {
      const content = isRawMode ? rawContent : serializeEnvVars(envVars);
      await writeFile(envPath, content);
      addNotification({
        type: 'success',
        message: 'Environment file saved successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to save file: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const handleRemoveVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const handleVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const toggleMode = () => {
    if (!isRawMode) {
      setRawContent(serializeEnvVars(envVars));
    } else {
      const parsed = parseEnvContent(rawContent);
      setEnvVars(parsed);
    }
    setIsRawMode(!isRawMode);
  };

  const maskValue = (value: string): string => {
    if (value.length <= 4) return '****';
    return value.substring(0, 4) + '*'.repeat(Math.min(value.length - 4, 20));
  };

  return (
    <div>
      <div className="content-header">
        <h2>AI & API Keys</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Environment File Location</h3>
          </div>
          
          <div className="form-group">
            <label className="form-label">File Path (.env.local)</label>
            <div className="path-selector">
              <input
                type="text"
                className="form-input"
                value={envPath}
                onChange={(e) => setEnvPath(e.target.value)}
                placeholder="Path to .env.local or .env file"
              />
              <button className="btn btn-secondary" onClick={handleBrowse}>
                Browse
              </button>
            </div>
            <span className="form-hint">
              Typically stored in your project root directory
            </span>
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={handleLoad} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner" /> : '📂'} Load File
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-between">
            <h3 className="card-title">Environment Variables</h3>
            <div className="flex gap-2">
              {!isRawMode && (
                <button className="btn btn-secondary" onClick={() => setShowValues(!showValues)}>
                  {showValues ? '🙈 Hide Values' : '👁️ Show Values'}
                </button>
              )}
              <button className="btn btn-secondary" onClick={toggleMode}>
                {isRawMode ? '📝 Form View' : '📄 Raw Text'}
              </button>
            </div>
          </div>

          {isRawMode ? (
            <div className="form-group">
              <textarea
                className="form-textarea"
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="KEY=value&#10;API_KEY=your_api_key_here"
                spellCheck={false}
                style={{ minHeight: '300px', fontFamily: 'Consolas, Monaco, monospace' }}
              />
            </div>
          ) : (
            <div>
              {envVars.map((envVar, index) => (
                <div key={index} className="form-row mb-2">
                  <div className="form-group" style={{ flex: 2 }}>
                    <input
                      type="text"
                      className="form-input"
                      value={envVar.key}
                      onChange={(e) => handleVarChange(index, 'key', e.target.value)}
                      placeholder="KEY_NAME"
                    />
                  </div>
                  <div className="form-group" style={{ flex: 3 }}>
                    <input
                      type={showValues ? 'text' : 'password'}
                      className="form-input"
                      value={envVar.value}
                      onChange={(e) => handleVarChange(index, 'value', e.target.value)}
                      placeholder="value"
                    />
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveVar(index)}
                    style={{ height: 'fit-content' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={handleAddVar}>
                + Add Variable
              </button>
            </div>
          )}

          <div className="btn-group mt-3">
            <button className="btn btn-success" onClick={handleSave} disabled={isLoading}>
              {isLoading ? <span className="loading-spinner" /> : '💾'} Save File
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Common API Keys</h3>
          </div>
          <p className="text-muted mb-2">Common environment variable names for popular AI services:</p>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8', fontFamily: 'monospace' }}>
            <li><strong>OpenAI:</strong> OPENAI_API_KEY</li>
            <li><strong>Anthropic (Claude):</strong> ANTHROPIC_API_KEY</li>
            <li><strong>Google (Gemini):</strong> GOOGLE_API_KEY</li>
            <li><strong>Cohere:</strong> COHERE_API_KEY</li>
            <li><strong>Hugging Face:</strong> HUGGINGFACE_API_KEY</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Security Note</h3>
          </div>
          <p style={{ lineHeight: '1.8' }}>
            ⚠️ <strong>Important:</strong> Never commit <code>.env</code> or <code>.env.local</code> files to version control.
            Add them to your <code>.gitignore</code> file to prevent accidental exposure of sensitive data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIKeys;
