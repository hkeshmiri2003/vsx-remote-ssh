# GitHub Personal Access Token Setup Guide

This guide explains how to create a GitHub Personal Access Token (PAT) with comprehensive permissions for accessing all GitHub services, including Copilot Pro, Codespaces, Agents, MCP Server, and other GitHub features.

## Overview

A GitHub Personal Access Token provides programmatic access to your GitHub account and services. This guide covers creating a token with full permissions for professional development workflows.

## Important Security Notes

⚠️ **CRITICAL SECURITY WARNINGS:**

- **NEVER commit tokens to Git repositories**
- **NEVER share tokens in public channels**
- **NEVER store tokens in plain text files**
- Store tokens in secure password managers or environment variables
- Rotate tokens regularly (every 90 days recommended)
- Use separate tokens for different purposes
- Review and revoke unused tokens regularly

## Token Types

GitHub offers two types of Personal Access Tokens:

### 1. Fine-grained Personal Access Tokens (Recommended)
- Repository-specific access control
- Granular permission settings
- Expiration dates required
- Better security and auditability

### 2. Classic Personal Access Tokens
- Account-wide access
- Broader scope options
- Optional expiration
- Compatible with older integrations

## Creating a Personal Access Token

### Step 1: Access Token Settings

1. Log in to **[GitHub.com](https://github.com)**
2. Click your **profile picture** in the top-right corner
3. Select **Settings**
4. Scroll down to **Developer settings** (bottom of left sidebar)
5. Click **Personal access tokens**
6. Choose either:
   - **Fine-grained tokens** (recommended for new tokens)
   - **Tokens (classic)** (for broader compatibility)

### Step 2: Create New Token

#### For Fine-grained Tokens:

1. Click **Generate new token** → **Fine-grained token**
2. Enter a **Token name**: e.g., "Full Access Development Token"
3. Set **Expiration**: Choose appropriate duration (90 days recommended)
4. Select **Resource owner**: Your account or organization
5. Configure **Repository access**:
   - Select **All repositories** for full access
   - Or choose **Only select repositories** for limited access

#### For Classic Tokens:

1. Click **Generate new token** → **Generate new token (classic)**
2. Enter a **Note**: e.g., "Full Access Development Token"
3. Set **Expiration**: Choose appropriate duration (90 days recommended)

### Step 3: Configure Token Permissions

#### Essential Scopes for Full GitHub Access

Select **ALL** of the following scopes for comprehensive access:

##### Repository Access
- ✅ **repo** - Full control of private repositories
  - `repo:status` - Access commit status
  - `repo_deployment` - Access deployment status
  - `public_repo` - Access public repositories
  - `repo:invite` - Access repository invitations
  - `security_events` - Read and write security events

##### Workflow and Actions
- ✅ **workflow** - Update GitHub Action workflows
- ✅ **write:packages** - Upload packages to GitHub Package Registry
- ✅ **read:packages** - Download packages from GitHub Package Registry
- ✅ **delete:packages** - Delete packages from GitHub Package Registry

##### Administrative Access
- ✅ **admin:org** - Full control of organizations
  - `write:org` - Read and write org and team membership
  - `read:org` - Read org and team membership
  - `manage_runners:org` - Manage org runners and runner groups
- ✅ **admin:public_key** - Full control of user public keys
- ✅ **admin:repo_hook** - Full control of repository hooks
- ✅ **admin:org_hook** - Full control of organization hooks

##### GitHub Apps and OAuth
- ✅ **admin:gpg_key** - Full control of user GPG keys
- ✅ **admin:ssh_signing_key** - Full control of user SSH signing keys

##### Codespaces (Essential for Development)
- ✅ **codespace** - Full control of codespaces
  - `codespace:secrets` - Ability to create, read, update, and delete codespace secrets

##### Copilot (Essential for AI Features)
- ✅ **copilot** - Access to GitHub Copilot
  - Required for Copilot chat, completions, and agents
  - Enables access to all Copilot Pro features
  - Supports Copilot Extensions and Agents

##### Notifications and User Data
- ✅ **notifications** - Access notifications
- ✅ **user** - Update ALL user data
  - `read:user` - Read ALL user profile data
  - `user:email` - Access user email addresses
  - `user:follow` - Follow and unfollow users

##### Discussions and Projects
- ✅ **discussion** - Read and write discussions
- ✅ **project** - Full control of projects

##### Gists
- ✅ **gist** - Create gists

##### Additional Permissions for Fine-grained Tokens

If using fine-grained tokens, also enable:

**Repository Permissions:**
- Actions: Read and write
- Administration: Read and write
- Checks: Read and write
- Code scanning alerts: Read and write
- Codespaces: Read and write
- Codespaces lifecycle admin: Read and write
- Codespaces metadata: Read and write
- Codespaces secrets: Read and write
- Commit statuses: Read and write
- Contents: Read and write
- Dependabot alerts: Read and write
- Dependabot secrets: Read and write
- Deployments: Read and write
- Discussions: Read and write
- Environments: Read and write
- Issues: Read and write
- Merge queues: Read and write
- Metadata: Read (mandatory)
- Pages: Read and write
- Projects: Read and write
- Pull requests: Read and write
- Secret scanning alerts: Read and write
- Secrets: Read and write
- Security events: Read and write
- Variables: Read and write
- Webhooks: Read and write
- Workflows: Read and write

**Account Permissions:**
- Copilot: Read and write
- Copilot Business: Read and write (if available)
- Codespaces user secrets: Read and write
- Email addresses: Read
- Followers: Read and write
- GPG keys: Read and write
- Git SSH keys: Read and write
- SSH signing keys: Read and write
- Profile: Read
- Starring: Read and write

### Step 4: Generate and Save Token

1. Scroll to the bottom and click **Generate token**
2. **IMMEDIATELY COPY THE TOKEN** - You will not be able to see it again
3. Store it securely in:
   - Password manager (recommended)
   - Encrypted file
   - Environment variable
   - Secure secrets management system

## Using the Token

### Authentication Methods

#### 1. HTTPS Git Operations

Replace your password with the token when prompted:

```bash
git clone https://github.com/username/repository.git
# Username: your-github-username
# Password: your-personal-access-token
```

#### 2. Git Credential Manager

Configure Git to use the token:

```bash
# Store credentials permanently
git config --global credential.helper store

# Or use cache (timeout after 1 hour)
git config --global credential.helper 'cache --timeout=3600'

# First git operation will prompt for credentials
git clone https://github.com/username/repository.git
# Enter token when prompted for password
```

#### 3. GitHub CLI

```bash
# Authenticate with token
echo "your-token" | gh auth login --with-token

# Verify authentication
gh auth status
```

#### 4. API Requests

```bash
# Using curl
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# Using GitHub REST API
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user/repos
```

#### 5. Environment Variables

```bash
# Linux/macOS
export GITHUB_TOKEN="your-token"

# Windows PowerShell
$env:GITHUB_TOKEN="your-token"

# Windows Command Prompt
set GITHUB_TOKEN=your-token

# Use in scripts
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

#### 6. SSH Config (for remote development)

Add to `~/.ssh/config`:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa
    PreferredAuthentications publickey
```

## GitHub Copilot Pro Integration

With Copilot permissions enabled, you can access:

### Copilot Features
- **Code Completions**: AI-powered code suggestions
- **Copilot Chat**: Conversational AI assistance
- **Copilot Agents**: Specialized AI agents for different tasks
- **Copilot Extensions**: Custom Copilot functionality
- **Multi-model Support**: Access to various AI models

### Using Copilot with Token

```bash
# Enable Copilot in VS Code
# Settings → Extensions → GitHub Copilot

# Or via CLI
gh copilot status

# Authenticate if needed
gh auth refresh -s copilot
```

## GitHub Codespaces Integration

With Codespaces permissions, you can:

### Codespace Features
- Create and manage codespaces
- Access codespace secrets
- Configure development environments
- Use codespace lifecycle management

### Using Codespaces

```bash
# Create codespace
gh codespace create --repo owner/repo

# List codespaces
gh codespace list

# Connect to codespace
gh codespace ssh --codespace name

# Access codespace in browser
gh codespace code --codespace name --web
```

## MCP Server and Agents

### Model Context Protocol (MCP) Server Access

With full permissions, you can interact with GitHub's MCP servers:

```bash
# Example: Query GitHub data through MCP
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/owner/repo/contents/

# Use with AI agents and tooling
# Token enables agents to access GitHub resources
```

### GitHub Agents

Access to GitHub Agents allows:
- Automated workflows
- CI/CD integrations
- Custom automation scripts
- Third-party tool integrations

## Token Management Best Practices

### 1. Token Organization

Create separate tokens for:
- Development workflows
- CI/CD pipelines
- Third-party integrations
- Personal scripts
- Team automation

### 2. Token Rotation

```bash
# Check token age
gh auth status

# Generate new token before expiration
# Update all services using the old token
# Revoke old token after migration
```

### 3. Token Audit

Regularly review token usage:
1. Go to **Settings** → **Developer settings** → **Personal access tokens**
2. Review **Last used** column
3. Revoke unused or old tokens
4. Update token permissions as needed

### 4. Secure Storage Examples

#### Using Environment Variables (Linux/macOS)

```bash
# Add to ~/.bashrc or ~/.zshrc
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Reload shell
source ~/.bashrc
```

#### Using Pass (Password Manager)

```bash
# Store token
pass insert github/token

# Retrieve token
export GITHUB_TOKEN=$(pass show github/token)
```

#### Using macOS Keychain

```bash
# Store token
security add-generic-password -a "$USER" -s "github_token" -w "ghp_xxxx"

# Retrieve token
security find-generic-password -a "$USER" -s "github_token" -w
```

## Troubleshooting

### Token Not Working

1. **Verify token permissions**:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
   ```

2. **Check token expiration**:
   - Go to Settings → Developer settings → Personal access tokens
   - Look for expiration date

3. **Ensure correct format**:
   - Classic tokens: `ghp_` prefix
   - Fine-grained tokens: `github_pat_` prefix

### Insufficient Permissions

If you get permission errors:
1. Review required scopes for the operation
2. Regenerate token with additional scopes
3. Update stored token in your applications

### Rate Limiting

```bash
# Check rate limit status
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit
```

Authenticated requests have higher rate limits:
- REST API: 5,000 requests/hour
- GraphQL API: 5,000 points/hour
- Search API: 30 requests/minute

## Integration with Remote SSH Extension

When using this Remote SSH extension with GitHub repositories:

### 1. Clone Repositories

```bash
# Connect to remote server via SSH
# Then clone using token
git clone https://YOUR_TOKEN@github.com/username/repo.git
```

### 2. Configure Git on Remote Server

```bash
# SSH into remote server
# Configure git credentials
git config --global credential.helper store
echo "https://YOUR_TOKEN:x-oauth-basic@github.com" > ~/.git-credentials
```

### 3. Use GitHub CLI on Remote Server

```bash
# Install GitHub CLI on remote server
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Authenticate
echo "YOUR_TOKEN" | gh auth login --with-token
```

## Additional Resources

- [GitHub Docs: Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Docs: About authentication to GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Codespaces Documentation](https://docs.github.com/en/codespaces)

## Support

For issues related to:
- **GitHub tokens**: [GitHub Support](https://support.github.com/)
- **This extension**: [Repository Issues](https://github.com/jajera/vsx-remote-ssh/issues)
- **Copilot**: [GitHub Copilot Support](https://github.com/community/community/discussions/categories/copilot)
- **Codespaces**: [Codespaces Support](https://github.com/community/community/discussions/categories/codespaces)

## License

This documentation is part of the VSX Remote SSH extension project, licensed under MIT License.
