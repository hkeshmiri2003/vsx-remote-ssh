import { readTextFile, writeTextFile, exists, createDir } from '@tauri-apps/api/fs';
import { open, save } from '@tauri-apps/api/dialog';
import { homeDir } from '@tauri-apps/api/path';

export const getDefaultVSCodeSettingsPath = async (): Promise<string> => {
  const home = await homeDir();
  const platform = await getPlatform();
  
  if (platform === 'win32') {
    return `${home}AppData\\Roaming\\Code\\User\\settings.json`;
  } else if (platform === 'darwin') {
    return `${home}Library/Application Support/Code/User/settings.json`;
  } else {
    return `${home}.config/Code/User/settings.json`;
  }
};

export const getPlatform = async (): Promise<string> => {
  const { platform } = await import('@tauri-apps/api/os');
  return platform();
};

export const readJsonFile = async (path: string): Promise<any> => {
  try {
    const content = await readTextFile(path);
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
};

export const writeJsonFile = async (path: string, data: any): Promise<void> => {
  try {
    const content = JSON.stringify(data, null, 2);
    await writeTextFile(path, content);
  } catch (error) {
    throw new Error(`Failed to write file: ${error}`);
  }
};

export const readFile = async (path: string): Promise<string> => {
  try {
    return await readTextFile(path);
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`);
  }
};

export const writeFile = async (path: string, content: string): Promise<void> => {
  try {
    await writeTextFile(path, content);
  } catch (error) {
    throw new Error(`Failed to write file: ${error}`);
  }
};

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    return await exists(path);
  } catch (error) {
    return false;
  }
};

export const ensureDirectory = async (path: string): Promise<void> => {
  try {
    const dirExists = await exists(path);
    if (!dirExists) {
      await createDir(path, { recursive: true });
    }
  } catch (error) {
    throw new Error(`Failed to create directory: ${error}`);
  }
};

export const selectFile = async (filters?: { name: string; extensions: string[] }[]): Promise<string | null> => {
  try {
    const selected = await open({
      multiple: false,
      directory: false,
      filters,
    });
    
    return typeof selected === 'string' ? selected : null;
  } catch (error) {
    console.error('Failed to open file dialog:', error);
    return null;
  }
};

export const selectDirectory = async (): Promise<string | null> => {
  try {
    const selected = await open({
      multiple: false,
      directory: true,
    });
    
    return typeof selected === 'string' ? selected : null;
  } catch (error) {
    console.error('Failed to open directory dialog:', error);
    return null;
  }
};

export const saveFileDialog = async (defaultPath?: string, filters?: { name: string; extensions: string[] }[]): Promise<string | null> => {
  try {
    const selected = await save({
      defaultPath,
      filters,
    });
    
    return selected;
  } catch (error) {
    console.error('Failed to open save dialog:', error);
    return null;
  }
};

export const mergeSettings = (base: any, updates: any): any => {
  const result = { ...base };
  
  for (const key in updates) {
    if (updates.hasOwnProperty(key)) {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
        result[key] = mergeSettings(result[key] || {}, updates[key]);
      } else {
        result[key] = updates[key];
      }
    }
  }
  
  return result;
};

export const formatJson = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

export const validateJson = (json: string): { valid: boolean; error?: string } => {
  try {
    JSON.parse(json);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
};
