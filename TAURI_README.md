# VSCode Super Config Manager

A modern desktop application built with Tauri, React, and TypeScript for managing VS Code configurations, workspace settings, API keys, extensions, MCP servers, SSH configurations, and backups.

## Features

### 8 Main Sections

1. **Dashboard** - Overview and quick access to common actions
2. **VS Code Settings** - Manage global VS Code `settings.json`
3. **Workspace Settings** - Configure workspace-specific `.vscode/settings.json`
4. **AI & API Keys** - Securely manage `.env.local` and API keys
5. **Extensions & Scripts** - Generate PowerShell/Bash scripts for extension installation
6. **MCP Servers** - Configure Model Context Protocol servers
7. **SSH / Remote Helpers** - Generate SSH configuration snippets
8. **Backup & Restore** - Create and restore configuration backups as ZIP files

### Key Capabilities

- ✅ **Dark Modern UI** - Beautiful dark theme with modern aesthetics
- ✅ **File I/O Operations** - Read, write, and merge configuration files
- ✅ **Script Generation** - Generate PowerShell (Windows) and Bash (Linux/macOS) scripts
- ✅ **Raw JSON Editor** - Toggle between form view and raw JSON editing
- ✅ **Path Selection** - Browse and select files/folders with default paths
- ✅ **Notifications** - Toast notifications for success/error messages
- ✅ **Error Handling** - Comprehensive error handling with user-friendly messages
- ✅ **Backup/Restore** - Create ZIP backups and restore from them

## Technology Stack

- **Desktop Framework**: Tauri 2.x (Rust backend)
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **Styling**: Custom CSS with CSS variables
- **File Operations**: Tauri File System Plugin
- **Dialog Operations**: Tauri Dialog Plugin
- **Archive Operations**: JSZip

## Prerequisites

### For Development

- **Node.js** 18+ and npm
- **Rust** 1.77.2+ (install from [rustup.rs](https://rustup.rs/))

### Platform-Specific Requirements

#### Windows
- Microsoft Visual Studio C++ Build Tools
- WebView2 (usually pre-installed on Windows 10/11)

#### Linux
```bash
sudo apt-get update
sudo apt-get install -y \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libappindicator3-dev \
    librsvg2-dev \
    patchelf \
    libglib2.0-dev
```

#### macOS
- Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

## Installation

### Clone the Repository

```bash
git clone https://github.com/hkeshmiri2003/vsx-remote-ssh.git
cd vsx-remote-ssh
```

### Install Dependencies

```bash
npm install
```

This will install both JavaScript/TypeScript dependencies and Tauri CLI.

## Development

### Run in Development Mode

```bash
npm run tauri dev
```

This command will:
1. Start the Vite development server on `http://localhost:5173`
2. Compile the Rust backend
3. Launch the Tauri application window with hot-reload enabled

**First run** may take several minutes as Rust dependencies are compiled.

### Development Workflow

1. Make changes to React components in `app/`
2. Save files - the app will hot-reload automatically
3. For Rust changes in `src-tauri/src/`, restart `npm run tauri dev`

## Building for Production

### Build for Current Platform

```bash
npm run tauri build
```

This creates optimized production builds in `src-tauri/target/release/bundle/`.

### Output Locations

#### Windows
- **MSI Installer**: `src-tauri/target/release/bundle/msi/VSCode Super Config Manager_1.0.0_x64_en-US.msi`
- **NSIS Installer**: `src-tauri/target/release/bundle/nsis/VSCode Super Config Manager_1.0.0_x64-setup.exe`
- **Standalone EXE**: `src-tauri/target/release/VSCode Super Config Manager.exe`

#### Linux
- **AppImage**: `src-tauri/target/release/bundle/appimage/vscode-super-config-manager_1.0.0_amd64.AppImage`
- **DEB Package**: `src-tauri/target/release/bundle/deb/vscode-super-config-manager_1.0.0_amd64.deb`

#### macOS
- **DMG**: `src-tauri/target/release/bundle/dmg/VSCode Super Config Manager_1.0.0_x64.dmg`
- **App Bundle**: `src-tauri/target/release/bundle/macos/VSCode Super Config Manager.app`

### Build Times

- **First Build**: 10-20 minutes (compiles all Rust dependencies)
- **Incremental Builds**: 1-3 minutes

## Project Structure

```
.
├── app/                        # React application source
│   ├── components/            # React components
│   │   └── Sidebar.tsx       # Navigation sidebar
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx
│   │   ├── VSCodeSettings.tsx
│   │   ├── WorkspaceSettings.tsx
│   │   ├── APIKeys.tsx
│   │   ├── Extensions.tsx
│   │   ├── MCPServers.tsx
│   │   ├── SSHConfig.tsx
│   │   └── BackupRestore.tsx
│   ├── utils/                # Utility functions
│   │   ├── fileUtils.ts      # File I/O operations
│   │   └── notifications.tsx # Notification system
│   ├── styles/               # CSS styles
│   │   └── global.css        # Global styles and theme
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── App.tsx               # Main app component
│   └── main.tsx              # App entry point
├── src-tauri/                # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs          # Rust entry point
│   │   └── lib.rs           # Tauri app setup
│   ├── Cargo.toml           # Rust dependencies
│   ├── tauri.conf.json      # Tauri configuration
│   ├── capabilities/        # Permission definitions
│   │   └── default.json
│   └── icons/               # Application icons
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── package.json             # Node dependencies
├── SPEC.md                  # Detailed specification
└── TAURI_README.md          # This file
```

## Usage Guide

### Dashboard

The Dashboard provides an overview and quick access to common actions. Use the sidebar to navigate between different sections.

### VS Code Settings

1. The default path is automatically detected based on your OS
2. Click "Load Settings" to read your current VS Code settings
3. Toggle between "Form View" and "Raw JSON" mode
4. Edit settings in Raw JSON mode
5. Click "Save Settings" to write changes

### Workspace Settings

1. Click "Browse" to select a workspace folder
2. Settings are saved to `.vscode/settings.json` in that folder
3. Edit and save similar to VS Code Settings

### AI & API Keys

1. Select or browse to your `.env.local` file
2. Add key-value pairs for API keys
3. Use "Show Values" / "Hide Values" to toggle visibility
4. Common API key names are provided for reference

### Extensions & Scripts

1. Enter VS Code extension IDs (one per line)
2. Or click "Load Example Extensions" for common extensions
3. Select script type (PowerShell or Bash)
4. Click "Generate Script"
5. Copy to clipboard or save to file

### MCP Servers

1. Load an existing `mcp.config.json` or start fresh
2. Click "Add Server" to configure a new MCP server
3. Enter server details (name, URL, API key, enabled status)
4. Save configuration

### SSH / Remote Helpers

1. Fill in SSH connection details (alias, hostname, username, port)
2. Optional: Add identity file path and additional options
3. Click "Generate Config"
4. Copy or save the SSH config snippet
5. Append to your `~/.ssh/config` file

### Backup & Restore

1. **Create Backup**:
   - Select configuration files to include
   - Provide file paths for each enabled item
   - Click "Create Backup"
   - Save the ZIP file

2. **Restore Backup**:
   - Click "Restore from Backup"
   - Select a backup ZIP file
   - Choose a restore directory
   - Files will be extracted to that location

## Configuration Files

The application manages the following configuration files:

- `settings.json` - VS Code global settings
  - Windows: `%APPDATA%\Code\User\settings.json`
  - macOS: `~/Library/Application Support/Code/User/settings.json`
  - Linux: `~/.config/Code/User/settings.json`

- `.vscode/settings.json` - Workspace-specific settings (in workspace root)
- `.env.local` - Environment variables and API keys (project-specific)
- `mcp.config.json` - MCP server configurations
- `~/.ssh/config` - SSH configuration (append generated snippets)

## Troubleshooting

### Build Issues

**Problem**: `error: failed to run custom build command for 'glib-sys'`

**Solution** (Linux):
```bash
sudo apt-get install libglib2.0-dev libgtk-3-dev libwebkit2gtk-4.1-dev
```

**Problem**: Build fails on Windows with C++ errors

**Solution**: Install Microsoft Visual Studio C++ Build Tools

**Problem**: `WebView2 not found` on Windows

**Solution**: Install WebView2 Runtime from Microsoft

### Runtime Issues

**Problem**: File dialog doesn't open

**Solution**: Check that file system permissions are properly configured in `src-tauri/capabilities/default.json`

**Problem**: Cannot read/write files

**Solution**: Ensure the application has permission to access the file system. On some systems, you may need to grant explicit permissions.

### Development Issues

**Problem**: Vite dev server doesn't start

**Solution**: 
```bash
# Kill any processes using port 5173
# On Linux/macOS:
lsof -ti:5173 | xargs kill -9
# On Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

**Problem**: Changes not reflected in dev mode

**Solution**: Restart `npm run tauri dev`. Some changes to Rust code or Tauri config require a restart.

## Security Considerations

- **API Keys**: API keys are stored in plain text in `.env.local`. Keep backups secure.
- **Sensitive Data**: Backup ZIP files may contain sensitive configuration data. Store them securely.
- **File Permissions**: The application requests broad file system access. Review `src-tauri/capabilities/default.json` for details.
- **Git**: Never commit `.env.local`, `mcp.config.json` with sensitive data, or backup ZIPs to version control.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/hkeshmiri2003/vsx-remote-ssh/issues)
- **Documentation**: See `SPEC.md` for detailed specifications
- **Discussions**: [GitHub Discussions](https://github.com/hkeshmiri2003/vsx-remote-ssh/discussions)

## Acknowledgments

- Built with [Tauri](https://tauri.app/)
- UI powered by [React](https://react.dev/)
- Icons from Unicode Emoji
- Inspired by the need for a unified VS Code configuration manager

## Changelog

### Version 1.0.0 (Initial Release)

- ✅ All 8 sections implemented (Dashboard, VS Code Settings, Workspace Settings, API Keys, Extensions, MCP Servers, SSH Config, Backup/Restore)
- ✅ Dark modern UI theme
- ✅ File I/O for all configuration types
- ✅ Script generation for PowerShell and Bash
- ✅ SSH config snippet generation
- ✅ ZIP-based backup and restore
- ✅ Notification system
- ✅ Error handling
- ✅ Cross-platform support (Windows, macOS, Linux)
