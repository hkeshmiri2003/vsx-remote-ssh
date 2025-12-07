# VSCode Super Config Manager - Specification

## Overview

The VSCode Super Config Manager is a modern desktop application built with Tauri, React, and TypeScript that provides a comprehensive GUI for managing VS Code configurations, workspace settings, API keys, extensions, MCP servers, SSH configurations, and backup/restore functionality.

## Technology Stack

- **Frontend**: React 18+ with TypeScript
- **UI Framework**: Modern component library with dark theme
- **Desktop Framework**: Tauri (for native desktop app with Windows EXE support)
- **Build Tool**: Vite
- **State Management**: React hooks and context
- **File Operations**: Tauri filesystem APIs
- **Archive Operations**: JSZip for backup/restore

## Application Structure

### Sidebar Navigation

The application features a vertical sidebar with the following sections:

1. **Dashboard** - Overview and quick actions
2. **VS Code Settings** - Manage global VS Code settings.json
3. **Workspace Settings** - Manage workspace-specific .vscode/settings.json
4. **AI & API Keys** - Manage .env.local and API keys
5. **Extensions & Scripts** - Manage VS Code extensions and utility scripts
6. **MCP Servers** - Configure MCP (Model Context Protocol) servers via mcp.config.json
7. **SSH / Remote Helpers** - Generate SSH config snippets
8. **Backup & Restore** - Create and restore configuration backups as ZIP files

## Feature Requirements

### 1. Dashboard

**Purpose**: Provide an overview of the system and quick access to common actions.

**Features**:
- Display summary of current configurations
- Quick action buttons for common tasks
- Recent activity log
- System status indicators

### 2. VS Code Settings

**Purpose**: Manage the global VS Code settings file.

**Features**:
- Read settings from default location: `~/.config/Code/User/settings.json` (Linux/Mac) or `%APPDATA%/Code/User/settings.json` (Windows)
- Path selection with default values
- Display settings in a structured form
- Raw JSON view/edit mode toggle
- Merge functionality to combine settings without overwriting
- Validation before saving
- Backup before modification
- Error handling with user-friendly messages

**File Paths**:
- Windows: `%APPDATA%\Code\User\settings.json`
- macOS: `~/Library/Application Support/Code/User/settings.json`
- Linux: `~/.config/Code/User/settings.json`

### 3. Workspace Settings

**Purpose**: Manage workspace-specific VS Code settings.

**Features**:
- Workspace folder selection
- Read/write `.vscode/settings.json` in selected workspace
- Form-based editing for common settings
- Raw JSON view/edit mode
- Merge with global settings preview
- Multiple workspace support
- Quick switch between workspaces

**File Path**: `<workspace>/.vscode/settings.json`

### 4. AI & API Keys

**Purpose**: Securely manage API keys and environment variables.

**Features**:
- Read/write `.env.local` file
- Secure display of API keys (masked by default)
- Common API key templates (OpenAI, Anthropic, Google, etc.)
- Key validation
- Path selection for .env.local location
- Export/import functionality
- Encrypted storage option

**File Path**: User-selected, typically in project root

### 5. Extensions & Scripts

**Purpose**: Manage VS Code extensions and generate utility scripts.

**Features**:
- List installed VS Code extensions
- Generate PowerShell scripts for extension installation
- Generate Bash scripts for extension installation
- Script templates for common tasks
- Copy to clipboard functionality
- Save scripts to file
- Platform-specific script generation (Windows/Linux/macOS)

**Script Examples**:
```powershell
# PowerShell
code --install-extension ms-python.python
code --install-extension ms-vscode.cpptools
```

```bash
# Bash
code --install-extension ms-python.python
code --install-extension ms-vscode.cpptools
```

### 6. MCP Servers

**Purpose**: Configure Model Context Protocol servers.

**Features**:
- Read/write `mcp.config.json`
- Add/edit/remove MCP server configurations
- Form-based configuration editor
- Raw JSON view/edit mode
- Validation of server URLs and settings
- Test connection functionality
- Default configurations for common MCP servers

**File Path**: User-selected, typically `~/.config/mcp/mcp.config.json`

**Configuration Example**:
```json
{
  "servers": {
    "my-server": {
      "url": "http://localhost:3000",
      "apiKey": "your-api-key",
      "enabled": true
    }
  }
}
```

### 7. SSH / Remote Helpers

**Purpose**: Generate SSH configuration snippets for remote development.

**Features**:
- Form to input SSH connection details
  - Host alias
  - Hostname/IP
  - Port (default 22)
  - Username
  - Identity file path
  - Additional options
- Generate SSH config snippet
- Copy to clipboard
- Append to `~/.ssh/config`
- Generate VS Code Remote-SSH configuration
- Test connection button (optional)

**Output Example**:
```
Host my-server
    HostName 192.168.1.100
    User developer
    Port 22
    IdentityFile ~/.ssh/id_rsa
    ForwardAgent yes
```

### 8. Backup & Restore

**Purpose**: Create and restore backups of all configurations.

**Features**:
- Create ZIP backup containing:
  - VS Code settings.json
  - Workspace settings (selected workspaces)
  - .env.local files
  - mcp.config.json
  - SSH config snippets
  - Extension lists
- Timestamp-based backup naming
- Backup location selection
- Restore from ZIP file
- Preview backup contents before restore
- Selective restore (choose what to restore)
- Backup history list
- Automatic backup before major changes

## UI/UX Requirements

### Design Principles

1. **Dark Modern Theme**: Default dark color scheme with modern aesthetics
2. **Responsive Layout**: Adapt to different window sizes
3. **Intuitive Navigation**: Clear sidebar with icons and labels
4. **Immediate Feedback**: Loading states, success/error notifications
5. **Accessibility**: Keyboard navigation, screen reader support

### Component Requirements

#### Sidebar
- Fixed left sidebar with icons and labels
- Active section highlighting
- Collapsible on small screens
- Quick keyboard shortcuts

#### Forms
- Labeled input fields
- Validation feedback (inline errors)
- Save/Cancel buttons
- Unsaved changes warning

#### File Path Selection
- Text input with browse button
- Default paths pre-populated
- Path validation
- Create directory option

#### Notifications
- Toast notifications for success/error
- Non-intrusive positioning (top-right)
- Auto-dismiss with manual dismiss option
- Different styles for info/success/warning/error

#### JSON Editor
- Syntax highlighting
- Line numbers
- Validation
- Format/beautify button
- Switch between form view and raw JSON

## Technical Implementation

### Tauri Setup

```json
// tauri.conf.json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "package": {
    "productName": "VSCode Super Config Manager",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "readFile": true,
        "writeFile": true,
        "readDir": true,
        "createDir": true
      },
      "dialog": {
        "all": true,
        "open": true,
        "save": true
      },
      "shell": {
        "all": false,
        "open": true
      }
    },
    "bundle": {
      "active": true,
      "targets": ["msi", "nsis"],
      "identifier": "com.vscode.config-manager",
      "icon": ["icons/icon.png"]
    },
    "windows": [{
      "title": "VSCode Super Config Manager",
      "width": 1200,
      "height": 800,
      "resizable": true,
      "fullscreen": false
    }]
  }
}
```

### File Operations

All file operations use Tauri's filesystem API:

```typescript
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { open } from '@tauri-apps/api/dialog';

// Read file
const content = await readTextFile(path);

// Write file
await writeTextFile(path, content);

// Open file dialog
const selected = await open({
  directory: false,
  multiple: false
});
```

### Error Handling

All file operations and user actions must include comprehensive error handling:

```typescript
try {
  const content = await readTextFile(path);
  // Process content
} catch (error) {
  // Show user-friendly error message
  showNotification({
    type: 'error',
    message: `Failed to read file: ${error.message}`
  });
}
```

## Build and Deployment

### Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Production Build

```bash
# Build for Windows
npm run tauri build

# Output: src-tauri/target/release/bundle/
# - .msi installer
# - .exe executable
```

### Build Configuration

The project must support:
- Windows EXE generation via Tauri bundler
- Proper code signing (optional but recommended)
- Version management
- Icon and branding assets

## Testing Requirements

### Manual Testing Checklist

- [ ] All sidebar sections are accessible
- [ ] File path selection works correctly
- [ ] Settings files are read correctly
- [ ] Settings files are written correctly
- [ ] Form validation works
- [ ] Raw JSON editing works
- [ ] Notifications appear and dismiss
- [ ] Backup creates ZIP file
- [ ] Restore from ZIP works
- [ ] Scripts generate correctly
- [ ] SSH config snippets are valid
- [ ] Error handling shows appropriate messages
- [ ] Dark theme is consistent
- [ ] Application builds successfully
- [ ] Windows EXE runs without errors

### Edge Cases

- Non-existent file paths
- Malformed JSON files
- Permission errors
- Large configuration files
- Special characters in paths
- Network connectivity for MCP servers

## Success Criteria

1. ✅ Application runs via `npm run tauri dev`
2. ✅ Application builds via `npm run tauri build` producing Windows EXE
3. ✅ All 8 sidebar sections are implemented
4. ✅ File I/O works for all configuration files
5. ✅ Script generation works for PowerShell and Bash
6. ✅ SSH config snippet generation works
7. ✅ Backup/Restore creates and restores ZIP files
8. ✅ Error handling and notifications work
9. ✅ Dark modern UI is implemented
10. ✅ README contains clear dev/build instructions

## Future Enhancements

- Cloud sync for backups
- Configuration templates library
- Multi-language support
- Automated configuration validation
- Integration with VS Code extensions API
- Theme customization
- Keyboard shortcuts customization
- Configuration diff viewer
- Rollback functionality
- Scheduled automatic backups
