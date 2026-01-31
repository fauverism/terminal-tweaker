// Terminal Tweaker - Main Application Logic

const app = {
    currentStep: 'onboarding',
    config: {
        mode: null,
        shell: 'bash',
        editor: null,
        prompt: {
            showUser: true,
            showPath: true,
            showGit: true,
            showTime: false,
            colorScheme: 'default'
        },
        plugins: [],
        aliases: [],
        customAliases: [],
        settings: {
            autocorrect: true,
            caseInsensitive: true,
            autocd: false,
            extendedGlob: true,
            historyShare: false,
            notifyLong: true,
            historySize: 10000,
            historyIgnore: 'duplicates'
        }
    },

    // Preset alias categories with lots of useful aliases
    aliasCategories: {
        git: {
            name: 'Git',
            icon: '⎇',
            badge: 'essential',
            aliases: [
                { id: 'gs', shortcut: 'gs', command: 'git status', desc: 'Show working tree status', recommended: true },
                { id: 'ga', shortcut: 'ga', command: 'git add', desc: 'Add files to staging', recommended: true },
                { id: 'gaa', shortcut: 'gaa', command: 'git add --all', desc: 'Stage all changes', recommended: true },
                { id: 'gc', shortcut: 'gc', command: 'git commit -m', desc: 'Commit with message', recommended: true },
                { id: 'gca', shortcut: 'gca', command: 'git commit --amend', desc: 'Amend last commit', recommended: false },
                { id: 'gp', shortcut: 'gp', command: 'git push', desc: 'Push to remote', recommended: true },
                { id: 'gpl', shortcut: 'gpl', command: 'git pull', desc: 'Pull from remote', recommended: true },
                { id: 'gco', shortcut: 'gco', command: 'git checkout', desc: 'Switch branches or restore files', recommended: true },
                { id: 'gcb', shortcut: 'gcb', command: 'git checkout -b', desc: 'Create and switch to new branch', recommended: true },
                { id: 'gb', shortcut: 'gb', command: 'git branch', desc: 'List branches', recommended: true },
                { id: 'gd', shortcut: 'gd', command: 'git diff', desc: 'Show changes', recommended: true },
                { id: 'gds', shortcut: 'gds', command: 'git diff --staged', desc: 'Show staged changes', recommended: false },
                { id: 'gl', shortcut: 'gl', command: 'git log --oneline -20', desc: 'Show recent commits', recommended: true },
                { id: 'glg', shortcut: 'glg', command: 'git log --graph --oneline --decorate', desc: 'Visual commit graph', recommended: false },
                { id: 'gst', shortcut: 'gst', command: 'git stash', desc: 'Stash changes', recommended: true },
                { id: 'gstp', shortcut: 'gstp', command: 'git stash pop', desc: 'Pop stashed changes', recommended: true },
                { id: 'grb', shortcut: 'grb', command: 'git rebase', desc: 'Rebase current branch', recommended: false },
                { id: 'grs', shortcut: 'grs', command: 'git reset', desc: 'Reset current HEAD', recommended: false },
                { id: 'grh', shortcut: 'grh', command: 'git reset --hard', desc: 'Hard reset (discard changes)', recommended: false },
                { id: 'gcp', shortcut: 'gcp', command: 'git cherry-pick', desc: 'Apply commit from another branch', recommended: false },
                { id: 'gf', shortcut: 'gf', command: 'git fetch --all --prune', desc: 'Fetch all remotes', recommended: true },
                { id: 'gm', shortcut: 'gm', command: 'git merge', desc: 'Merge branch', recommended: false }
            ]
        },
        navigation: {
            name: 'Navigation',
            icon: '📁',
            badge: 'essential',
            aliases: [
                { id: 'dotdot', shortcut: '..', command: 'cd ..', desc: 'Go up one directory', recommended: true },
                { id: 'dotdotdot', shortcut: '...', command: 'cd ../..', desc: 'Go up two directories', recommended: true },
                { id: 'dotx4', shortcut: '....', command: 'cd ../../..', desc: 'Go up three directories', recommended: false },
                { id: 'dash', shortcut: '-', command: 'cd -', desc: 'Go to previous directory', recommended: true },
                { id: 'home', shortcut: '~', command: 'cd ~', desc: 'Go to home directory', recommended: false },
                { id: 'mkcd', shortcut: 'mkcd', command: 'function mkcd() { mkdir -p "$1" && cd "$1"; }', desc: 'Create dir and cd into it', recommended: true },
                { id: 'projects', shortcut: 'proj', command: 'cd ~/projects', desc: 'Go to projects folder', recommended: false },
                { id: 'desktop', shortcut: 'desk', command: 'cd ~/Desktop', desc: 'Go to Desktop', recommended: false },
                { id: 'downloads', shortcut: 'dl', command: 'cd ~/Downloads', desc: 'Go to Downloads', recommended: false }
            ]
        },
        listing: {
            name: 'File Listing',
            icon: '📋',
            badge: 'essential',
            aliases: [
                { id: 'll', shortcut: 'll', command: 'ls -lah', desc: 'Long listing with hidden files', recommended: true },
                { id: 'la', shortcut: 'la', command: 'ls -A', desc: 'List all except . and ..', recommended: true },
                { id: 'l', shortcut: 'l', command: 'ls -CF', desc: 'Compact listing with indicators', recommended: true },
                { id: 'lt', shortcut: 'lt', command: 'ls -ltrh', desc: 'List by time (newest last)', recommended: true },
                { id: 'lsize', shortcut: 'lsize', command: 'ls -lSrh', desc: 'List by size (largest last)', recommended: false },
                { id: 'tree1', shortcut: 't1', command: 'tree -L 1', desc: 'Tree view depth 1', recommended: false },
                { id: 'tree2', shortcut: 't2', command: 'tree -L 2', desc: 'Tree view depth 2', recommended: false },
                { id: 'lsd', shortcut: 'lsd', command: 'ls -d */', desc: 'List directories only', recommended: false }
            ]
        },
        docker: {
            name: 'Docker',
            icon: '🐳',
            badge: 'popular',
            aliases: [
                { id: 'dps', shortcut: 'dps', command: 'docker ps', desc: 'List running containers', recommended: true },
                { id: 'dpsa', shortcut: 'dpsa', command: 'docker ps -a', desc: 'List all containers', recommended: true },
                { id: 'di', shortcut: 'di', command: 'docker images', desc: 'List images', recommended: true },
                { id: 'dex', shortcut: 'dex', command: 'docker exec -it', desc: 'Execute in container', recommended: true },
                { id: 'dlog', shortcut: 'dlog', command: 'docker logs -f', desc: 'Follow container logs', recommended: true },
                { id: 'drm', shortcut: 'drm', command: 'docker rm', desc: 'Remove container', recommended: false },
                { id: 'drmi', shortcut: 'drmi', command: 'docker rmi', desc: 'Remove image', recommended: false },
                { id: 'dstop', shortcut: 'dstop', command: 'docker stop $(docker ps -q)', desc: 'Stop all containers', recommended: false },
                { id: 'dprune', shortcut: 'dprune', command: 'docker system prune -af', desc: 'Remove unused data', recommended: false },
                { id: 'dcu', shortcut: 'dcu', command: 'docker-compose up -d', desc: 'Start compose services', recommended: true },
                { id: 'dcd', shortcut: 'dcd', command: 'docker-compose down', desc: 'Stop compose services', recommended: true },
                { id: 'dcl', shortcut: 'dcl', command: 'docker-compose logs -f', desc: 'Follow compose logs', recommended: true },
                { id: 'dcb', shortcut: 'dcb', command: 'docker-compose build', desc: 'Build compose images', recommended: false }
            ]
        },
        npm: {
            name: 'NPM / Yarn',
            icon: '📦',
            badge: 'popular',
            aliases: [
                { id: 'ni', shortcut: 'ni', command: 'npm install', desc: 'Install dependencies', recommended: true },
                { id: 'nid', shortcut: 'nid', command: 'npm install --save-dev', desc: 'Install as dev dependency', recommended: true },
                { id: 'nig', shortcut: 'nig', command: 'npm install -g', desc: 'Install globally', recommended: false },
                { id: 'nr', shortcut: 'nr', command: 'npm run', desc: 'Run npm script', recommended: true },
                { id: 'nrs', shortcut: 'nrs', command: 'npm run start', desc: 'Start project', recommended: true },
                { id: 'nrd', shortcut: 'nrd', command: 'npm run dev', desc: 'Start dev server', recommended: true },
                { id: 'nrb', shortcut: 'nrb', command: 'npm run build', desc: 'Build project', recommended: true },
                { id: 'nrt', shortcut: 'nrt', command: 'npm run test', desc: 'Run tests', recommended: true },
                { id: 'nrl', shortcut: 'nrl', command: 'npm run lint', desc: 'Run linter', recommended: false },
                { id: 'nci', shortcut: 'nci', command: 'npm ci', desc: 'Clean install', recommended: false },
                { id: 'nout', shortcut: 'nout', command: 'npm outdated', desc: 'Check outdated packages', recommended: false },
                { id: 'yi', shortcut: 'yi', command: 'yarn install', desc: 'Yarn install', recommended: false },
                { id: 'ya', shortcut: 'ya', command: 'yarn add', desc: 'Yarn add package', recommended: false },
                { id: 'yad', shortcut: 'yad', command: 'yarn add --dev', desc: 'Yarn add dev dependency', recommended: false }
            ]
        },
        python: {
            name: 'Python',
            icon: '🐍',
            badge: null,
            aliases: [
                { id: 'py', shortcut: 'py', command: 'python3', desc: 'Run Python 3', recommended: true },
                { id: 'pip', shortcut: 'pip', command: 'pip3', desc: 'Use pip3', recommended: true },
                { id: 'venv', shortcut: 'venv', command: 'python3 -m venv venv', desc: 'Create virtual environment', recommended: true },
                { id: 'activate', shortcut: 'act', command: 'source venv/bin/activate', desc: 'Activate venv', recommended: true },
                { id: 'deact', shortcut: 'deact', command: 'deactivate', desc: 'Deactivate venv', recommended: false },
                { id: 'pipreq', shortcut: 'pipreq', command: 'pip freeze > requirements.txt', desc: 'Save requirements', recommended: false },
                { id: 'pipinst', shortcut: 'pipinst', command: 'pip install -r requirements.txt', desc: 'Install from requirements', recommended: false },
                { id: 'pytest', shortcut: 'pyt', command: 'python -m pytest', desc: 'Run pytest', recommended: false }
            ]
        },
        kubernetes: {
            name: 'Kubernetes',
            icon: '☸️',
            badge: null,
            aliases: [
                { id: 'k', shortcut: 'k', command: 'kubectl', desc: 'Kubectl shorthand', recommended: true },
                { id: 'kgp', shortcut: 'kgp', command: 'kubectl get pods', desc: 'Get pods', recommended: true },
                { id: 'kgs', shortcut: 'kgs', command: 'kubectl get services', desc: 'Get services', recommended: true },
                { id: 'kgd', shortcut: 'kgd', command: 'kubectl get deployments', desc: 'Get deployments', recommended: true },
                { id: 'kga', shortcut: 'kga', command: 'kubectl get all', desc: 'Get all resources', recommended: true },
                { id: 'kd', shortcut: 'kd', command: 'kubectl describe', desc: 'Describe resource', recommended: true },
                { id: 'kl', shortcut: 'kl', command: 'kubectl logs -f', desc: 'Follow pod logs', recommended: true },
                { id: 'kex', shortcut: 'kex', command: 'kubectl exec -it', desc: 'Exec into pod', recommended: true },
                { id: 'kaf', shortcut: 'kaf', command: 'kubectl apply -f', desc: 'Apply manifest', recommended: true },
                { id: 'kdel', shortcut: 'kdel', command: 'kubectl delete', desc: 'Delete resource', recommended: false },
                { id: 'kctx', shortcut: 'kctx', command: 'kubectl config use-context', desc: 'Switch context', recommended: false },
                { id: 'kns', shortcut: 'kns', command: 'kubectl config set-context --current --namespace', desc: 'Set namespace', recommended: false }
            ]
        },
        system: {
            name: 'System Utils',
            icon: '🔧',
            badge: null,
            aliases: [
                { id: 'ports', shortcut: 'ports', command: 'netstat -tulanp 2>/dev/null || lsof -i -P -n', desc: 'Show listening ports', recommended: true },
                { id: 'myip', shortcut: 'myip', command: 'curl -s ifconfig.me', desc: 'Show public IP', recommended: true },
                { id: 'localip', shortcut: 'localip', command: "ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}'", desc: 'Show local IP', recommended: true },
                { id: 'df', shortcut: 'duh', command: 'du -sh * | sort -hr', desc: 'Disk usage by folder', recommended: true },
                { id: 'free', shortcut: 'mem', command: 'free -h 2>/dev/null || vm_stat', desc: 'Memory usage', recommended: false },
                { id: 'psg', shortcut: 'psg', command: 'ps aux | grep -v grep | grep', desc: 'Search processes', recommended: true },
                { id: 'killport', shortcut: 'killport', command: "function killport() { kill -9 $(lsof -t -i:$1); }", desc: 'Kill process on port', recommended: true },
                { id: 'path', shortcut: 'path', command: 'echo $PATH | tr ":" "\\n"', desc: 'Show PATH entries', recommended: false },
                { id: 'reload', shortcut: 'reload', command: 'source ~/.zshrc 2>/dev/null || source ~/.bash_profile', desc: 'Reload shell config', recommended: true },
                { id: 'hosts', shortcut: 'hosts', command: 'sudo $EDITOR /etc/hosts', desc: 'Edit hosts file', recommended: false },
                { id: 'week', shortcut: 'week', command: 'date +%V', desc: 'Show week number', recommended: false },
                { id: 'timer', shortcut: 'timer', command: 'echo "Timer started. Stop with Ctrl-D." && date && time cat && date', desc: 'Simple stopwatch', recommended: false }
            ]
        },
        safety: {
            name: 'Safety Aliases',
            icon: '🛡️',
            badge: null,
            aliases: [
                { id: 'rm', shortcut: 'rm', command: 'rm -i', desc: 'Confirm before removing', recommended: true },
                { id: 'cp', shortcut: 'cp', command: 'cp -i', desc: 'Confirm before overwriting', recommended: true },
                { id: 'mv', shortcut: 'mv', command: 'mv -i', desc: 'Confirm before overwriting', recommended: true },
                { id: 'ln', shortcut: 'ln', command: 'ln -i', desc: 'Confirm before overwriting', recommended: false },
                { id: 'mkdir', shortcut: 'mkdir', command: 'mkdir -pv', desc: 'Create parent dirs + verbose', recommended: true },
                { id: 'trash', shortcut: 'trash', command: 'function trash() { mv "$@" ~/.Trash/; }', desc: 'Move to trash instead of delete', recommended: true }
            ]
        },
        shortcuts: {
            name: 'Quick Shortcuts',
            icon: '⚡',
            badge: 'popular',
            aliases: [
                { id: 'c', shortcut: 'c', command: 'clear', desc: 'Clear terminal', recommended: true },
                { id: 'h', shortcut: 'h', command: 'history', desc: 'Show history', recommended: true },
                { id: 'hg', shortcut: 'hg', command: 'history | grep', desc: 'Search history', recommended: true },
                { id: 'q', shortcut: 'q', command: 'exit', desc: 'Quit terminal', recommended: false },
                { id: 'please', shortcut: 'please', command: 'sudo $(fc -ln -1)', desc: 'Re-run last command with sudo', recommended: true },
                { id: 'now', shortcut: 'now', command: 'date +"%Y-%m-%d %H:%M:%S"', desc: 'Current timestamp', recommended: false },
                { id: 'weather', shortcut: 'weather', command: 'curl wttr.in', desc: 'Show weather', recommended: false },
                { id: 'serve', shortcut: 'serve', command: 'python3 -m http.server 8000', desc: 'Quick HTTP server', recommended: true },
                { id: 'json', shortcut: 'json', command: 'python3 -m json.tool', desc: 'Pretty print JSON', recommended: false },
                { id: 'uuid', shortcut: 'uuid', command: 'uuidgen | tr "[:upper:]" "[:lower:]"', desc: 'Generate UUID', recommended: false }
            ]
        }
    },

    // Plugin database
    plugins: {
        vim: [
            { id: 'nerdtree', name: 'NERDTree', category: 'navigation', desc: 'File system explorer for browsing directories', recommended: true },
            { id: 'vim-airline', name: 'vim-airline', category: 'ui', desc: 'Lean & mean status/tabline', recommended: true },
            { id: 'fzf', name: 'fzf.vim', category: 'search', desc: 'Fuzzy file finder integration', recommended: true },
            { id: 'vim-fugitive', name: 'vim-fugitive', category: 'git', desc: 'Git wrapper for vim', recommended: true },
            { id: 'ale', name: 'ALE', category: 'linting', desc: 'Asynchronous Lint Engine', recommended: false },
            { id: 'vim-surround', name: 'vim-surround', category: 'editing', desc: 'Easily delete, change and add surroundings', recommended: true },
            { id: 'vim-commentary', name: 'vim-commentary', category: 'editing', desc: 'Comment stuff out', recommended: true },
            { id: 'vim-gitgutter', name: 'vim-gitgutter', category: 'git', desc: 'Shows git diff in the sign column', recommended: false }
        ],
        neovim: [
            { id: 'nvim-tree', name: 'nvim-tree', category: 'navigation', desc: 'File explorer written in Lua', recommended: true },
            { id: 'telescope', name: 'telescope.nvim', category: 'search', desc: 'Highly extendable fuzzy finder', recommended: true },
            { id: 'lualine', name: 'lualine.nvim', category: 'ui', desc: 'Blazing fast statusline plugin', recommended: true },
            { id: 'nvim-treesitter', name: 'nvim-treesitter', category: 'syntax', desc: 'Syntax highlighting and parsing', recommended: true },
            { id: 'nvim-lspconfig', name: 'nvim-lspconfig', category: 'lsp', desc: 'Quickstart configs for LSP', recommended: true },
            { id: 'nvim-cmp', name: 'nvim-cmp', category: 'completion', desc: 'Completion plugin written in Lua', recommended: true },
            { id: 'gitsigns', name: 'gitsigns.nvim', category: 'git', desc: 'Git integration for buffers', recommended: true },
            { id: 'which-key', name: 'which-key.nvim', category: 'ui', desc: 'Display available keybindings', recommended: false }
        ],
        emacs: [
            { id: 'evil', name: 'Evil', category: 'editing', desc: 'Extensible vi layer for Emacs', recommended: true },
            { id: 'magit', name: 'Magit', category: 'git', desc: 'Git porcelain inside Emacs', recommended: true },
            { id: 'helm', name: 'Helm', category: 'search', desc: 'Incremental completion and selection', recommended: true },
            { id: 'company', name: 'Company', category: 'completion', desc: 'Modular text completion framework', recommended: true },
            { id: 'projectile', name: 'Projectile', category: 'navigation', desc: 'Project interaction library', recommended: true },
            { id: 'flycheck', name: 'Flycheck', category: 'linting', desc: 'On-the-fly syntax checking', recommended: false },
            { id: 'org-mode', name: 'Org Mode', category: 'productivity', desc: 'Notes, planning, and authoring', recommended: true }
        ],
        nano: [
            { id: 'syntax-highlighting', name: 'Syntax Highlighting', category: 'ui', desc: 'Enable syntax highlighting for common languages', recommended: true },
            { id: 'line-numbers', name: 'Line Numbers', category: 'ui', desc: 'Display line numbers', recommended: true },
            { id: 'auto-indent', name: 'Auto Indent', category: 'editing', desc: 'Automatic indentation', recommended: true },
            { id: 'mouse-support', name: 'Mouse Support', category: 'ui', desc: 'Enable mouse support', recommended: false }
        ],
        vscode: [
            { id: 'vim-extension', name: 'Vim', category: 'editing', desc: 'Vim emulation for VSCode', recommended: false },
            { id: 'gitlens', name: 'GitLens', category: 'git', desc: 'Supercharge Git capabilities', recommended: true },
            { id: 'prettier', name: 'Prettier', category: 'formatting', desc: 'Code formatter', recommended: true },
            { id: 'eslint', name: 'ESLint', category: 'linting', desc: 'Integrates ESLint JavaScript', recommended: true },
            { id: 'path-intellisense', name: 'Path Intellisense', category: 'completion', desc: 'Autocomplete filenames', recommended: true }
        ]
    },

    // Color schemes for prompts
    colorSchemes: {
        default: {
            user: '#61afef',
            path: '#98c379',
            git: '#e06c75',
            time: '#c678dd'
        },
        dracula: {
            user: '#8be9fd',
            path: '#50fa7b',
            git: '#ff79c6',
            time: '#bd93f9'
        },
        monokai: {
            user: '#66d9ef',
            path: '#a6e22e',
            git: '#f92672',
            time: '#ae81ff'
        },
        gruvbox: {
            user: '#83a598',
            path: '#b8bb26',
            git: '#fb4934',
            time: '#d3869b'
        }
    },

    init() {
        this.updatePrompt();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentStep = screenId;
    },

    startFresh() {
        this.config.mode = 'fresh';
        this.showScreen('shell-selection');
    },

    importExisting() {
        this.config.mode = 'import';
        // Create file input for importing
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.bash_profile,.bashrc,.zshrc,.vimrc,.emacs';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                this.parseExistingConfig(event.target.result);
                this.showScreen('shell-selection');
            };
            reader.readAsText(file);
        };
        input.click();
    },

    parseExistingConfig(content) {
        // Basic parsing of existing config
        // This is a simplified version - could be expanded
        if (content.includes('PS1')) {
            this.config.shell = 'bash';
        } else if (content.includes('PROMPT')) {
            this.config.shell = 'zsh';
        }
    },

    nextStep() {
        const steps = ['shell-selection', 'editor-selection', 'prompt-customization', 'alias-builder', 'plugins-selection'];
        const currentIndex = steps.indexOf(this.currentStep);

        if (this.currentStep === 'shell-selection') {
            this.config.shell = document.querySelector('input[name="shell"]:checked').value;
        } else if (this.currentStep === 'editor-selection') {
            const selectedEditor = document.querySelector('input[name="editor"]:checked');
            if (!selectedEditor) {
                alert('Please select an editor');
                return;
            }
            this.config.editor = selectedEditor.value;
        } else if (this.currentStep === 'prompt-customization') {
            // Load alias builder when moving to it
            this.loadAliasBuilder();
        } else if (this.currentStep === 'alias-builder') {
            // Save settings before moving on
            this.saveAliasSettings();
            this.loadPlugins();
        }

        if (currentIndex < steps.length - 1) {
            this.showScreen(steps[currentIndex + 1]);
        }
    },

    prevStep() {
        const steps = ['shell-selection', 'editor-selection', 'prompt-customization', 'alias-builder', 'plugins-selection'];
        const currentIndex = steps.indexOf(this.currentStep);

        if (currentIndex > 0) {
            this.showScreen(steps[currentIndex - 1]);
        }
    },

    updatePrompt() {
        const showUser = document.getElementById('show-user')?.checked ?? true;
        const showPath = document.getElementById('show-path')?.checked ?? true;
        const showGit = document.getElementById('show-git')?.checked ?? true;
        const showTime = document.getElementById('show-time')?.checked ?? false;
        const colorScheme = document.querySelector('input[name="color-scheme"]:checked')?.value ?? 'default';

        this.config.prompt = { showUser, showPath, showGit, showTime, colorScheme };

        const colors = this.colorSchemes[colorScheme];
        let promptHTML = '';

        if (showTime) {
            promptHTML += `<span style="color: ${colors.time}">[18:52]</span> `;
        }
        if (showUser) {
            promptHTML += `<span style="color: ${colors.user}">user@hostname</span>`;
        }
        if (showPath) {
            promptHTML += ` <span style="color: ${colors.path}">~/projects/my-app</span>`;
        }
        if (showGit) {
            promptHTML += ` <span style="color: ${colors.git}">(main)</span>`;
        }
        promptHTML += ' $ ';

        document.getElementById('prompt-preview').innerHTML = promptHTML;
    },

    // ==========================================
    // ALIAS BUILDER FUNCTIONS
    // ==========================================

    loadAliasBuilder() {
        const container = document.getElementById('alias-categories');
        container.innerHTML = '';

        // Pre-select recommended aliases if first load
        if (this.config.aliases.length === 0) {
            this.selectRecommended();
        }

        // Render each category
        Object.keys(this.aliasCategories).forEach(categoryId => {
            const category = this.aliasCategories[categoryId];
            const categoryEl = this.createCategoryElement(categoryId, category);
            container.appendChild(categoryEl);
        });

        // Render custom aliases
        this.renderCustomAliases();

        // Update count
        this.updateAliasCount();
    },

    createCategoryElement(categoryId, category) {
        const div = document.createElement('div');
        div.className = 'alias-category';
        div.id = `category-${categoryId}`;

        const selectedInCategory = category.aliases.filter(a => this.config.aliases.includes(a.id)).length;
        const allSelected = selectedInCategory === category.aliases.length;

        let badgeHTML = '';
        if (category.badge) {
            badgeHTML = `<span class="category-badge ${category.badge}">${category.badge}</span>`;
        }

        div.innerHTML = `
            <div class="category-header" onclick="app.toggleCategory('${categoryId}')">
                <div class="category-info">
                    <span class="category-icon">${category.icon}</span>
                    <span class="category-name">${category.name}</span>
                    ${badgeHTML}
                    <span class="category-count">(${selectedInCategory}/${category.aliases.length})</span>
                </div>
                <div class="category-toggle">
                    <input type="checkbox" class="category-checkbox"
                        ${allSelected ? 'checked' : ''}
                        onclick="event.stopPropagation(); app.toggleCategoryAll('${categoryId}', this.checked)">
                    <span class="expand-icon">▼</span>
                </div>
            </div>
            <div class="alias-list">
                ${category.aliases.map(alias => this.createAliasItemHTML(alias)).join('')}
            </div>
        `;

        return div;
    },

    createAliasItemHTML(alias) {
        const isSelected = this.config.aliases.includes(alias.id);
        return `
            <div class="alias-item ${alias.recommended ? 'recommended' : ''}" data-alias-id="${alias.id}">
                <input type="checkbox"
                    id="alias-${alias.id}"
                    ${isSelected ? 'checked' : ''}
                    onchange="app.toggleAlias('${alias.id}')">
                <div class="alias-details">
                    <div>
                        <span class="alias-shortcut">${alias.shortcut}</span>
                        <span class="alias-arrow">→</span>
                        <span class="alias-command">${this.escapeHtml(alias.command)}</span>
                    </div>
                    <div class="alias-desc">${alias.desc}</div>
                </div>
            </div>
        `;
    },

    toggleCategory(categoryId) {
        const categoryEl = document.getElementById(`category-${categoryId}`);
        categoryEl.classList.toggle('expanded');
    },

    toggleCategoryAll(categoryId, checked) {
        const category = this.aliasCategories[categoryId];

        category.aliases.forEach(alias => {
            if (checked && !this.config.aliases.includes(alias.id)) {
                this.config.aliases.push(alias.id);
            } else if (!checked) {
                const index = this.config.aliases.indexOf(alias.id);
                if (index > -1) {
                    this.config.aliases.splice(index, 1);
                }
            }
        });

        // Re-render category
        const categoryEl = document.getElementById(`category-${categoryId}`);
        const wasExpanded = categoryEl.classList.contains('expanded');
        const newCategoryEl = this.createCategoryElement(categoryId, category);
        if (wasExpanded) newCategoryEl.classList.add('expanded');
        categoryEl.replaceWith(newCategoryEl);

        this.updateAliasCount();
    },

    toggleAlias(aliasId) {
        const index = this.config.aliases.indexOf(aliasId);
        if (index > -1) {
            this.config.aliases.splice(index, 1);
        } else {
            this.config.aliases.push(aliasId);
        }

        // Update category count and checkbox
        for (const [categoryId, category] of Object.entries(this.aliasCategories)) {
            if (category.aliases.some(a => a.id === aliasId)) {
                const selectedCount = category.aliases.filter(a => this.config.aliases.includes(a.id)).length;
                const categoryEl = document.getElementById(`category-${categoryId}`);
                const countEl = categoryEl.querySelector('.category-count');
                const checkboxEl = categoryEl.querySelector('.category-checkbox');

                countEl.textContent = `(${selectedCount}/${category.aliases.length})`;
                checkboxEl.checked = selectedCount === category.aliases.length;
                break;
            }
        }

        this.updateAliasCount();
    },

    filterAliases() {
        const searchTerm = document.getElementById('alias-search').value.toLowerCase();

        Object.keys(this.aliasCategories).forEach(categoryId => {
            const category = this.aliasCategories[categoryId];
            const categoryEl = document.getElementById(`category-${categoryId}`);
            const aliasItems = categoryEl.querySelectorAll('.alias-item');

            let visibleCount = 0;
            aliasItems.forEach(item => {
                const aliasId = item.dataset.aliasId;
                const alias = category.aliases.find(a => a.id === aliasId);

                const matches = alias.shortcut.toLowerCase().includes(searchTerm) ||
                               alias.command.toLowerCase().includes(searchTerm) ||
                               alias.desc.toLowerCase().includes(searchTerm);

                item.style.display = matches ? 'flex' : 'none';
                if (matches) visibleCount++;
            });

            // Hide entire category if no matches
            categoryEl.style.display = visibleCount > 0 || !searchTerm ? 'block' : 'none';

            // Auto-expand categories with matches
            if (searchTerm && visibleCount > 0) {
                categoryEl.classList.add('expanded');
            }
        });
    },

    // Custom Alias Functions
    validateAliasName() {
        const nameInput = document.getElementById('alias-name');
        const hint = document.getElementById('alias-name-hint');
        const name = nameInput.value;

        // Check format
        if (name && !/^[a-zA-Z0-9_-]+$/.test(name)) {
            hint.textContent = 'Invalid characters';
            hint.className = 'form-hint error';
            return false;
        }

        // Check for duplicates
        const isDuplicate = this.config.customAliases.some(a => a.shortcut === name) ||
            Object.values(this.aliasCategories).some(cat =>
                cat.aliases.some(a => a.shortcut === name)
            );

        if (isDuplicate) {
            hint.textContent = 'Alias already exists';
            hint.className = 'form-hint error';
            return false;
        }

        if (name) {
            hint.textContent = 'Looks good!';
            hint.className = 'form-hint success';
        } else {
            hint.textContent = 'Letters, numbers, hyphens only';
            hint.className = 'form-hint';
        }

        return true;
    },

    addCustomAlias() {
        const nameInput = document.getElementById('alias-name');
        const commandInput = document.getElementById('alias-command');
        const descInput = document.getElementById('alias-description');

        const name = nameInput.value.trim();
        const command = commandInput.value.trim();
        const desc = descInput.value.trim();

        if (!name || !command) {
            alert('Please enter both a shortcut and command');
            return;
        }

        if (!this.validateAliasName()) {
            return;
        }

        const customAlias = {
            id: `custom-${Date.now()}`,
            shortcut: name,
            command: command,
            desc: desc || 'Custom alias'
        };

        this.config.customAliases.push(customAlias);

        // Clear form
        nameInput.value = '';
        commandInput.value = '';
        descInput.value = '';
        document.getElementById('alias-name-hint').textContent = 'Letters, numbers, hyphens only';
        document.getElementById('alias-name-hint').className = 'form-hint';

        this.renderCustomAliases();
        this.updateAliasCount();
    },

    renderCustomAliases() {
        const container = document.getElementById('custom-aliases-list');

        if (this.config.customAliases.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✨</div>
                    <p>No custom aliases yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.config.customAliases.map(alias => `
            <div class="custom-alias-item" data-id="${alias.id}">
                <div class="custom-alias-info">
                    <span class="alias-shortcut">${this.escapeHtml(alias.shortcut)}</span>
                    <span class="alias-arrow">→</span>
                    <span class="alias-command">${this.escapeHtml(alias.command)}</span>
                    ${alias.desc ? `<div class="alias-desc">${this.escapeHtml(alias.desc)}</div>` : ''}
                </div>
                <div class="custom-alias-actions">
                    <button class="btn-icon delete" onclick="app.deleteCustomAlias('${alias.id}')" title="Delete">✕</button>
                </div>
            </div>
        `).join('');
    },

    deleteCustomAlias(aliasId) {
        this.config.customAliases = this.config.customAliases.filter(a => a.id !== aliasId);
        this.renderCustomAliases();
        this.updateAliasCount();
    },

    updateAliasCount() {
        const presetCount = this.config.aliases.length;
        const customCount = this.config.customAliases.length;
        const total = presetCount + customCount;

        const countEl = document.getElementById('alias-count');
        countEl.textContent = `${total} alias${total !== 1 ? 'es' : ''} selected`;
    },

    clearAllAliases() {
        this.config.aliases = [];
        this.config.customAliases = [];
        this.loadAliasBuilder();
    },

    selectRecommended() {
        this.config.aliases = [];

        Object.values(this.aliasCategories).forEach(category => {
            category.aliases.forEach(alias => {
                if (alias.recommended) {
                    this.config.aliases.push(alias.id);
                }
            });
        });

        // Re-render if already loaded
        if (document.getElementById('alias-categories').children.length > 0) {
            this.loadAliasBuilder();
        }
    },

    saveAliasSettings() {
        // Save settings from the UI
        this.config.settings = {
            autocorrect: document.getElementById('setting-autocorrect')?.checked ?? true,
            caseInsensitive: document.getElementById('setting-case-insensitive')?.checked ?? true,
            autocd: document.getElementById('setting-autocd')?.checked ?? false,
            extendedGlob: document.getElementById('setting-extended-glob')?.checked ?? true,
            historyShare: document.getElementById('setting-history-share')?.checked ?? false,
            notifyLong: document.getElementById('setting-notify-long')?.checked ?? true,
            historySize: parseInt(document.getElementById('history-size')?.value ?? '10000'),
            historyIgnore: document.getElementById('history-ignore')?.value ?? 'duplicates'
        };
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // ==========================================
    // END ALIAS BUILDER FUNCTIONS
    // ==========================================

    loadPlugins() {
        const editor = this.config.editor;
        const pluginsContainer = document.getElementById('plugins-container');
        const editorNameSpan = document.getElementById('selected-editor-name');

        editorNameSpan.textContent = editor;
        pluginsContainer.innerHTML = '';

        const editorPlugins = this.plugins[editor] || [];

        editorPlugins.forEach(plugin => {
            const card = document.createElement('div');
            card.className = 'plugin-card' + (plugin.recommended ? ' selected' : '');
            card.innerHTML = `
                <div class="plugin-header">
                    <input type="checkbox" id="plugin-${plugin.id}" ${plugin.recommended ? 'checked' : ''} onchange="app.togglePlugin('${plugin.id}')">
                    <div class="plugin-info">
                        <div class="plugin-name">${plugin.name}</div>
                        <div class="plugin-category">${plugin.category}</div>
                    </div>
                </div>
                <div class="plugin-desc">${plugin.desc}</div>
            `;
            pluginsContainer.appendChild(card);
        });

        // Initialize selected plugins
        this.config.plugins = editorPlugins.filter(p => p.recommended).map(p => p.id);
    },

    togglePlugin(pluginId) {
        const index = this.config.plugins.indexOf(pluginId);
        if (index > -1) {
            this.config.plugins.splice(index, 1);
        } else {
            this.config.plugins.push(pluginId);
        }

        // Update card styling
        const checkbox = document.getElementById(`plugin-${pluginId}`);
        const card = checkbox.closest('.plugin-card');
        if (checkbox.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    },

    generateConfig() {
        const configContent = this.buildConfigFile();
        document.getElementById('config-content').textContent = configContent;

        // Update filename
        const filename = this.config.shell === 'bash' ? '.bash_profile' : '.zshrc';
        document.getElementById('config-filename').textContent = filename;

        // Update installation steps
        this.updateInstallSteps();

        this.showScreen('export-screen');
    },

    buildConfigFile() {
        const { shell, editor, prompt, plugins, aliases, customAliases, settings } = this.config;
        const colors = this.colorSchemes[prompt.colorScheme];

        let config = shell === 'bash' ? '#!/bin/bash\n' : '#!/bin/zsh\n';
        config += '# Generated by terminal-tweaker\n';
        config += `# Date: ${new Date().toLocaleDateString()}\n\n`;

        // Shell settings (zsh-specific options)
        if (shell === 'zsh') {
            config += '# Shell Options\n';
            if (settings.autocorrect) {
                config += 'setopt CORRECT           # Command auto-correction\n';
                config += 'setopt CORRECT_ALL       # Argument auto-correction\n';
            }
            if (settings.caseInsensitive) {
                config += 'zstyle \':completion:*\' matcher-list \'m:{a-zA-Z}={A-Za-z}\' # Case insensitive completion\n';
            }
            if (settings.autocd) {
                config += 'setopt AUTO_CD           # cd into directories by name\n';
            }
            if (settings.extendedGlob) {
                config += 'setopt EXTENDED_GLOB     # Extended globbing patterns\n';
            }
            if (settings.historyShare) {
                config += 'setopt SHARE_HISTORY     # Share history across sessions\n';
            }
            config += '\n';
        } else {
            // Bash-specific options
            config += '# Shell Options\n';
            if (settings.autocorrect) {
                config += 'shopt -s cdspell         # Auto-correct cd misspellings\n';
            }
            if (settings.caseInsensitive) {
                config += 'bind "set completion-ignore-case on"  # Case insensitive completion\n';
            }
            if (settings.extendedGlob) {
                config += 'shopt -s globstar        # Enable ** recursive glob\n';
            }
            config += '\n';
        }

        // Build prompt
        config += '# Custom Prompt Configuration\n';

        if (shell === 'bash') {
            if (prompt.showGit) {
                config += '\n# Git branch in prompt\n';
                config += 'parse_git_branch() {\n';
                config += '    git branch 2> /dev/null | sed -e \'/^[^*]/d\' -e \'s/* \\(.*\\)/ (\\1)/\'\n';
                config += '}\n\n';
            }

            let ps1 = 'PS1="';

            if (prompt.showTime) {
                ps1 += '\\[\\033[38;2;199;120;221m\\][\\t]\\[\\033[0m\\] ';
            }
            if (prompt.showUser) {
                const rgb = this.hexToRgb(colors.user);
                ps1 += `\\[\\033[38;2;${rgb.r};${rgb.g};${rgb.b}m\\]\\u@\\h\\[\\033[0m\\]`;
            }
            if (prompt.showPath) {
                const rgb = this.hexToRgb(colors.path);
                ps1 += ` \\[\\033[38;2;${rgb.r};${rgb.g};${rgb.b}m\\]\\w\\[\\033[0m\\]`;
            }
            if (prompt.showGit) {
                const rgb = this.hexToRgb(colors.git);
                ps1 += `\\[\\033[38;2;${rgb.r};${rgb.g};${rgb.b}m\\]\\$(parse_git_branch)\\[\\033[0m\\]`;
            }
            ps1 += ' $ "\n';
            config += ps1;
        } else {
            // zsh configuration
            config += 'autoload -Uz vcs_info\n';
            config += 'precmd() { vcs_info }\n';
            config += 'setopt PROMPT_SUBST\n\n';

            if (prompt.showGit) {
                config += 'zstyle \':vcs_info:git:*\' formats \'(%b)\'\n';
            }

            let prompt_str = 'PROMPT="';
            if (prompt.showTime) {
                prompt_str += '%F{magenta}[%T]%f ';
            }
            if (prompt.showUser) {
                prompt_str += '%F{blue}%n@%m%f';
            }
            if (prompt.showPath) {
                prompt_str += ' %F{green}%~%f';
            }
            if (prompt.showGit) {
                prompt_str += ' %F{red}${vcs_info_msg_0_}%f';
            }
            prompt_str += ' $ "\n';
            config += prompt_str;
        }

        // Editor configuration
        config += `\n# Editor Configuration\n`;
        config += `export EDITOR="${editor}"\n`;
        config += `export VISUAL="${editor}"\n\n`;

        // History Configuration
        config += '# History Configuration\n';
        config += `export HISTSIZE=${settings.historySize}\n`;
        config += `export HISTFILESIZE=${settings.historySize * 2}\n`;

        if (shell === 'bash') {
            if (settings.historyIgnore === 'duplicates') {
                config += 'export HISTCONTROL=ignoredups:erasedups\n';
            } else if (settings.historyIgnore === 'spaces') {
                config += 'export HISTCONTROL=ignorespace\n';
            } else if (settings.historyIgnore === 'both') {
                config += 'export HISTCONTROL=ignoreboth:erasedups\n';
            }
        } else {
            if (settings.historyIgnore === 'duplicates' || settings.historyIgnore === 'both') {
                config += 'setopt HIST_IGNORE_DUPS\n';
                config += 'setopt HIST_IGNORE_ALL_DUPS\n';
            }
            if (settings.historyIgnore === 'spaces' || settings.historyIgnore === 'both') {
                config += 'setopt HIST_IGNORE_SPACE\n';
            }
        }
        config += '\n';

        // Generate aliases section
        config += '# ==========================================\n';
        config += '# ALIASES\n';
        config += '# ==========================================\n\n';

        // Collect functions that need to be defined
        const functions = [];

        // Group aliases by category for nice output
        Object.entries(this.aliasCategories).forEach(([, category]) => {
            const selectedAliases = category.aliases.filter(a => aliases.includes(a.id));

            if (selectedAliases.length > 0) {
                config += `# ${category.name}\n`;

                selectedAliases.forEach(alias => {
                    // Check if it's a function
                    if (alias.command.startsWith('function ')) {
                        functions.push(alias);
                    } else {
                        config += `alias ${alias.shortcut}="${alias.command}"\n`;
                    }
                });
                config += '\n';
            }
        });

        // Add custom aliases
        if (customAliases.length > 0) {
            config += '# Custom Aliases\n';
            customAliases.forEach(alias => {
                if (alias.command.startsWith('function ')) {
                    functions.push(alias);
                } else {
                    config += `alias ${alias.shortcut}="${alias.command}"\n`;
                }
            });
            config += '\n';
        }

        // Add functions
        if (functions.length > 0) {
            config += '# Functions\n';
            functions.forEach(fn => {
                // Extract function definition
                const fnMatch = fn.command.match(/function\s+(\w+)\s*\(\)\s*\{(.+)\}/);
                if (fnMatch) {
                    config += `${fn.shortcut}() {${fnMatch[2]}}\n`;
                } else {
                    // Fallback: just output the command
                    config += `${fn.command}\n`;
                    config += `alias ${fn.shortcut}="${fn.shortcut}"\n`;
                }
            });
            config += '\n';
        }

        // Color support
        config += '# Enable color support\n';
        config += 'export CLICOLOR=1\n';
        config += 'export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd\n\n';

        // Long-running command notification
        if (settings.notifyLong && shell === 'zsh') {
            config += '# Notify on long-running commands (>30s)\n';
            config += 'autoload -Uz add-zsh-hook\n';
            config += 'LONG_RUNNING_THRESHOLD=30\n';
            config += 'function _long_running_preexec() {\n';
            config += '    _cmd_start_time=$SECONDS\n';
            config += '}\n';
            config += 'function _long_running_precmd() {\n';
            config += '    if [[ -n $_cmd_start_time ]]; then\n';
            config += '        local elapsed=$(($SECONDS - $_cmd_start_time))\n';
            config += '        if [[ $elapsed -gt $LONG_RUNNING_THRESHOLD ]]; then\n';
            config += '            echo "\\a" # Bell notification\n';
            config += '        fi\n';
            config += '        unset _cmd_start_time\n';
            config += '    fi\n';
            config += '}\n';
            config += 'add-zsh-hook preexec _long_running_preexec\n';
            config += 'add-zsh-hook precmd _long_running_precmd\n\n';
        }

        // Plugin-specific configurations
        if (plugins.length > 0) {
            config += `# ${editor.charAt(0).toUpperCase() + editor.slice(1)} Plugins\n`;
            config += `# Install these plugins for enhanced functionality:\n`;

            const editorPlugins = this.plugins[editor] || [];
            plugins.forEach(pluginId => {
                const plugin = editorPlugins.find(p => p.id === pluginId);
                if (plugin) {
                    config += `#   - ${plugin.name}: ${plugin.desc}\n`;
                }
            });
            config += '\n';

            if (editor === 'vim' || editor === 'neovim') {
                config += this.generateVimConfig();
            } else if (editor === 'emacs') {
                config += this.generateEmacsConfig();
            }
        }

        // Path additions
        config += '# Path additions\n';
        config += '# export PATH="$HOME/bin:$PATH"\n';

        return config;
    },

    generateVimConfig() {
        let vimConfig = '\n# Vim/Neovim Configuration\n';
        vimConfig += '# Create ~/.vimrc with the following content:\n';
        vimConfig += '# (or for neovim: ~/.config/nvim/init.vim)\n';
        vimConfig += '<<VIMRC\n';
        vimConfig += 'set number\n';
        vimConfig += 'set relativenumber\n';
        vimConfig += 'set expandtab\n';
        vimConfig += 'set tabstop=4\n';
        vimConfig += 'set shiftwidth=4\n';
        vimConfig += 'set smartindent\n';
        vimConfig += 'syntax on\n';
        vimConfig += 'set background=dark\n';

        if (this.config.plugins.includes('nerdtree') || this.config.plugins.includes('nvim-tree')) {
            vimConfig += '\n" File explorer keybinding\n';
            vimConfig += 'nnoremap <C-n> :NERDTreeToggle<CR>\n';
        }

        vimConfig += 'VIMRC\n';
        return vimConfig;
    },

    generateEmacsConfig() {
        let emacsConfig = '\n# Emacs Configuration\n';
        emacsConfig += '# Add to ~/.emacs or ~/.emacs.d/init.el\n';
        emacsConfig += '<<EMACS\n';
        emacsConfig += '(setq inhibit-startup-screen t)\n';
        emacsConfig += '(menu-bar-mode -1)\n';
        emacsConfig += '(tool-bar-mode -1)\n';
        emacsConfig += '(scroll-bar-mode -1)\n';
        emacsConfig += '(setq-default indent-tabs-mode nil)\n';
        emacsConfig += '(setq-default tab-width 4)\n';
        emacsConfig += 'EMACS\n';
        return emacsConfig;
    },

    updateInstallSteps() {
        const { shell, editor } = this.config;
        const filename = shell === 'bash' ? '.bash_profile' : '.zshrc';

        let steps = `
            <li>Download the configuration file using the button below</li>
            <li>Move it to your home directory: <code>mv ~/Downloads/${filename} ~/${filename}</code></li>
            <li>Reload your shell: <code>source ~/${filename}</code></li>
        `;

        if (editor === 'vim' || editor === 'neovim') {
            steps += `<li>Install vim-plug for plugin management: <code>curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim</code></li>`;
            steps += `<li>Create your .vimrc file with the suggested configuration</li>`;
        } else if (editor === 'emacs') {
            steps += `<li>Add the suggested configuration to your ~/.emacs file</li>`;
        }

        document.getElementById('install-steps').innerHTML = steps;
    },

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    },

    downloadConfig() {
        const content = document.getElementById('config-content').textContent;
        const filename = this.config.shell === 'bash' ? '.bash_profile' : '.zshrc';

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    },

    copyToClipboard() {
        const content = document.getElementById('config-content').textContent;
        navigator.clipboard.writeText(content).then(() => {
            const btn = document.querySelector('.btn-copy');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    },

    restart() {
        this.config = {
            mode: null,
            shell: 'bash',
            editor: null,
            prompt: {
                showUser: true,
                showPath: true,
                showGit: true,
                showTime: false,
                colorScheme: 'default'
            },
            plugins: [],
            aliases: [],
            customAliases: [],
            settings: {
                autocorrect: true,
                caseInsensitive: true,
                autocd: false,
                extendedGlob: true,
                historyShare: false,
                notifyLong: true,
                historySize: 10000,
                historyIgnore: 'duplicates'
            }
        };
        this.showScreen('onboarding');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
