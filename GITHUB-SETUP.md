# GitHub Repository Setup Guide

## 🚀 Creating Your EduLedger Repository

### Step 1: Install Git (if not already installed)

#### Windows:
```bash
# Download Git from: https://git-scm.com/download/win
# Or use winget:
winget install Git.Git
```

#### macOS:
```bash
# Using Homebrew
brew install git

# Or download from: https://git-scm.com/download/mac
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install git

# CentOS/RHEL
sudo yum install git
```

### Step 2: Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Repository
```bash
cd C:\Users\ADECROWN\CascadeProjects\EduLedger
git init
```

### Step 4: Create .gitignore
```bash
# Create .gitignore file
echo "node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
.vscode/
*.log
coverage/
.nyc_output
.cache/
.parcel-cache/
.tmp/
.temp/
" > .gitignore
```

### Step 5: Add Files to Git
```bash
git add .
git status
```

### Step 6: Initial Commit
```bash
git commit -m "Initial commit: EduLedger - Stellar-based education platform

- Stellar smart contracts for EDU tokens and credentials
- React frontend with modern UI
- IPFS storage integration
- Complete deployment documentation
- Learn-to-earn mechanics with staking"
```

### Step 7: Create GitHub Repository

#### Option A: Using GitHub CLI (Recommended)
```bash
# Install GitHub CLI first
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: sudo apt install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create EduLedger --public --description "EduLedger - Decentralized Education Platform on Stellar" --source=. --remote=origin --push
```

#### Option B: Manual GitHub Setup
1. Go to https://github.com/organizations/your-org-name
2. Click "New repository"
3. Repository name: `EduLedger`
4. Description: `EduLedger - Decentralized Education Platform on Stellar`
5. Set as Public (or Private if preferred)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

Then run:
```bash
git remote add origin https://github.com/YOUR-ORG/EduLedger.git
git branch -M main
git push -u origin main
```

### Step 8: Verify Repository
```bash
git remote -v
git log --oneline
```

## 📋 Repository Structure After Setup

```
EduLedger/
├── .git/
├── .gitignore
├── README.md
├── DEPLOYMENT.md
├── GITHUB-SETUP.md
├── package.json
├── tsconfig.json
├── contracts/
│   ├── EduToken.sol
│   └── CredentialNFT.sol
├── stellar/
│   ├── EduToken.ts
│   └── CredentialNFT.ts
├── storage/
│   └── IPFSStorage.ts
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── Header.tsx
│   │   └── pages/
│   │       └── Dashboard.tsx
│   └── ...
└── Web3-Education-Projects.md
```

## 🔧 Additional GitHub Setup

### Create GitHub Issues Template
Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0]
- Node.js version: [e.g. 18.17.0]
- Browser: [e.g. Chrome, Safari]

**Additional context**
Add any other context about the problem here.
```

### Create Feature Request Template
Create `.github/ISSUE_TEMPLATE/feature_request.md`:
```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Create Pull Request Template
Create `.github/pull_request_template.md`:
```markdown
## Description
Please include a summary of the change and which issue is fixed. Please also include relevant motivation and context. List any dependencies that are required for this change.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules
```

### Create GitHub Actions Workflow
Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build

  frontend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run frontend tests
      run: npm test -- --watchAll=false
    
    - name: Build frontend
      run: npm run build
```

## 🚀 Next Steps

### 1. Set Up Branch Protection
1. Go to repository settings
2. Click "Branches" 
3. Add branch protection rule for `main`
4. Require pull request reviews
5. Require status checks to pass before merging
6. Include required status checks: "CI"

### 2. Add Collaborators
1. Go to repository settings
2. Click "Collaborators and teams"
3. Add team members or individual collaborators

### 3. Set Up Project Board
1. Click "Projects" tab
2. Create new project board
3. Add columns: To Do, In Progress, Review, Done

### 4. Enable GitHub Pages (for documentation)
1. Go to repository settings
2. Scroll to "GitHub Pages"
3. Source: Deploy from a branch
4. Branch: main, / (root)
5. Save

### 5. Add Repository Topics
Go to repository settings and add topics:
- `blockchain`
- `stellar`
- `education`
- `web3`
- `nft`
- `credentials`
- `typescript`
- `react`
- `ipfs`

## 📊 Repository Badge

Add this to your README.md:

```markdown
![CI](https://github.com/YOUR-ORG/EduLedger/workflows/CI/badge.svg)
![License: MIT](https://img.shields.io/github/license/YOUR-ORG/EduLedger)
![GitHub stars](https://img.shields.io/github/stars/YOUR-ORG/EduLedger?style=social)
![GitHub forks](https://img.shields.io/github/forks/YOUR-ORG/EduLedger?style=social)
```

## 🎉 Repository Ready!

Once you complete these steps, your EduLedger repository will be:
- ✅ Properly version controlled with Git
- ✅ Hosted on GitHub under your organization
- ✅ Configured with CI/CD
- ✅ Ready for collaboration
- ✅ Professionally documented

Your repository URL will be: `https://github.com/YOUR-ORG/EduLedger`

Good luck with your EduLedger project! 🚀
