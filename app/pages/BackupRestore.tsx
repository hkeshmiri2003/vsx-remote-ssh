import React, { useState } from 'react';
import JSZip from 'jszip';
import { readFile, writeFile, selectFile, selectDirectory, saveFileDialog, fileExists } from '../utils/fileUtils';
import { useNotifications } from '../utils/notifications';

interface BackupItem {
  label: string;
  path: string;
  enabled: boolean;
}

const BackupRestore: React.FC = () => {
  const [backupItems, setBackupItems] = useState<BackupItem[]>([
    { label: 'VS Code Settings', path: '', enabled: true },
    { label: 'Workspace Settings', path: '', enabled: false },
    { label: '.env.local', path: '', enabled: false },
    { label: 'MCP Config', path: '', enabled: false },
    { label: 'SSH Config', path: '', enabled: false },
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { addNotification } = useNotifications();

  const handleToggleItem = (index: number) => {
    const updated = [...backupItems];
    updated[index].enabled = !updated[index].enabled;
    setBackupItems(updated);
  };

  const handleBrowsePath = async (index: number) => {
    const selected = await selectFile([
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'Environment Files', extensions: ['env', 'local'] },
      { name: 'All Files', extensions: ['*'] },
    ]);
    if (selected) {
      const updated = [...backupItems];
      updated[index].path = selected;
      setBackupItems(updated);
    }
  };

  const handleCreateBackup = async () => {
    const enabledItems = backupItems.filter(item => item.enabled && item.path);
    
    if (enabledItems.length === 0) {
      addNotification({
        type: 'warning',
        message: 'No items selected for backup',
      });
      return;
    }

    setIsBackingUp(true);
    try {
      const zip = new JSZip();
      
      // Add each file to the zip
      for (const item of enabledItems) {
        try {
          const exists = await fileExists(item.path);
          if (exists) {
            const content = await readFile(item.path);
            const fileName = item.path.split(/[\\/]/).pop() || 'file';
            zip.file(fileName, content);
          } else {
            addNotification({
              type: 'warning',
              message: `File not found: ${item.label}`,
            });
          }
        } catch (error: any) {
          addNotification({
            type: 'warning',
            message: `Failed to read ${item.label}: ${error.message}`,
          });
        }
      }

      // Add a manifest file
      const manifest = {
        timestamp: new Date().toISOString(),
        items: enabledItems.map(item => ({
          label: item.label,
          originalPath: item.path,
        })),
      };
      zip.file('backup-manifest.json', JSON.stringify(manifest, null, 2));

      // Generate zip blob
      const blob = await zip.generateAsync({ type: 'uint8array' });
      
      // Save the zip file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const defaultName = `vscode-config-backup-${timestamp}.zip`;
      
      const savePath = await saveFileDialog(defaultName, [
        { name: 'ZIP Archive', extensions: ['zip'] },
      ]);

      if (savePath) {
        // Convert Uint8Array to string for Tauri
        // We'll use base64 encoding
        const base64 = btoa(String.fromCharCode(...blob));
        // For binary files, we need to write differently
        // Since Tauri's writeTextFile doesn't handle binary well,
        // we'll use a workaround by writing the content
        await writeFile(savePath, base64);
        
        addNotification({
          type: 'success',
          message: `Backup created successfully: ${defaultName}`,
          duration: 7000,
        });
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to create backup: ${error.message}`,
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async () => {
    const selected = await selectFile([
      { name: 'ZIP Archive', extensions: ['zip'] },
    ]);

    if (!selected) return;

    setIsRestoring(true);
    try {
      // Read the zip file
      const content = await readFile(selected);
      const base64Data = content;
      
      // Convert base64 back to binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const zip = await JSZip.loadAsync(bytes);
      
      // Read manifest
      const manifestFile = zip.file('backup-manifest.json');
      if (manifestFile) {
        const manifestContent = await manifestFile.async('string');
        const manifest = JSON.parse(manifestContent);
        
        addNotification({
          type: 'info',
          message: `Backup created: ${new Date(manifest.timestamp).toLocaleString()}`,
          duration: 7000,
        });
      }

      // List all files in the zip
      const files = Object.keys(zip.files).filter(name => name !== 'backup-manifest.json');
      
      if (files.length === 0) {
        addNotification({
          type: 'warning',
          message: 'No files found in backup',
        });
        return;
      }

      // Ask user where to restore
      const restoreDir = await selectDirectory();
      if (!restoreDir) {
        addNotification({
          type: 'info',
          message: 'Restore cancelled',
        });
        return;
      }

      // Extract files
      for (const fileName of files) {
        const file = zip.files[fileName];
        if (!file.dir) {
          const content = await file.async('string');
          const targetPath = `${restoreDir}/${fileName}`;
          await writeFile(targetPath, content);
        }
      }

      addNotification({
        type: 'success',
        message: `Restored ${files.length} file(s) to ${restoreDir}`,
        duration: 7000,
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        message: `Failed to restore backup: ${error.message}`,
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div>
      <div className="content-header">
        <h2>Backup & Restore</h2>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Create Backup</h3>
          </div>
          
          <p className="text-muted mb-3">
            Select the configuration files you want to include in the backup.
            The backup will be saved as a ZIP file.
          </p>

          {backupItems.map((item, index) => (
            <div key={index} className="mb-3">
              <div className="flex-between mb-1">
                <label className="flex" style={{ alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => handleToggleItem(index)}
                    style={{ marginRight: '8px' }}
                  />
                  <strong>{item.label}</strong>
                </label>
              </div>
              {item.enabled && (
                <div className="path-selector">
                  <input
                    type="text"
                    className="form-input"
                    value={item.path}
                    onChange={(e) => {
                      const updated = [...backupItems];
                      updated[index].path = e.target.value;
                      setBackupItems(updated);
                    }}
                    placeholder={`Path to ${item.label.toLowerCase()}`}
                  />
                  <button className="btn btn-secondary" onClick={() => handleBrowsePath(index)}>
                    Browse
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="btn-group mt-3">
            <button 
              className="btn btn-success" 
              onClick={handleCreateBackup}
              disabled={isBackingUp}
            >
              {isBackingUp ? <span className="loading-spinner" /> : '💾'} Create Backup
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Restore Backup</h3>
          </div>
          
          <p className="text-muted mb-3">
            Select a backup ZIP file to restore. You'll be asked where to extract the files.
          </p>

          <div className="btn-group">
            <button 
              className="btn btn-primary" 
              onClick={handleRestoreBackup}
              disabled={isRestoring}
            >
              {isRestoring ? <span className="loading-spinner" /> : '📂'} Restore from Backup
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Backup Information</h3>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Backups are saved as ZIP files with a timestamp</li>
            <li>A manifest file is included with backup details</li>
            <li>You can restore backups to any location</li>
            <li>Original file paths are preserved in the manifest</li>
            <li>It's recommended to create regular backups before making changes</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">⚠️ Important Notes</h3>
          </div>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Backup sensitive data carefully:</strong> API keys and credentials will be included</li>
            <li><strong>Store backups securely:</strong> Keep backup files in a safe location</li>
            <li><strong>Test restores:</strong> Verify that backups can be restored successfully</li>
            <li><strong>Version control:</strong> Consider using git for code-related configs</li>
            <li><strong>Exclude from git:</strong> Don't commit backup ZIPs with sensitive data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
