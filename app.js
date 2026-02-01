// Terminal Tweaker - Main Application Logic

const app = {
    currentStep: 'onboarding',
    STORAGE_KEY: 'terminal-tweaker-config',
    currentConfigTab: 'main',
    starshipConfig: '',

    config: {
        mode: null,
        shell: 'bash',
        framework: 'none', // none, ohmyzsh, ohmybash, starship, fisher
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

    // Extended color schemes for prompts and terminal preview
    colorSchemes: {
        default: {
            name: 'One Dark',
            background: '#282c34',
            foreground: '#abb2bf',
            user: '#61afef',
            path: '#98c379',
            git: '#e06c75',
            time: '#c678dd',
            command: '#e5c07b',
            dir: '#61afef',
            file: '#abb2bf',
            exec: '#98c379',
            error: '#e06c75',
            success: '#98c379',
            warning: '#e5c07b',
            muted: '#5c6370'
        },
        dracula: {
            name: 'Dracula',
            background: '#282a36',
            foreground: '#f8f8f2',
            user: '#8be9fd',
            path: '#50fa7b',
            git: '#ff79c6',
            time: '#bd93f9',
            command: '#f1fa8c',
            dir: '#8be9fd',
            file: '#f8f8f2',
            exec: '#50fa7b',
            error: '#ff5555',
            success: '#50fa7b',
            warning: '#f1fa8c',
            muted: '#6272a4'
        },
        monokai: {
            name: 'Monokai',
            background: '#272822',
            foreground: '#f8f8f2',
            user: '#66d9ef',
            path: '#a6e22e',
            git: '#f92672',
            time: '#ae81ff',
            command: '#e6db74',
            dir: '#66d9ef',
            file: '#f8f8f2',
            exec: '#a6e22e',
            error: '#f92672',
            success: '#a6e22e',
            warning: '#e6db74',
            muted: '#75715e'
        },
        gruvbox: {
            name: 'Gruvbox',
            background: '#282828',
            foreground: '#ebdbb2',
            user: '#83a598',
            path: '#b8bb26',
            git: '#fb4934',
            time: '#d3869b',
            command: '#fabd2f',
            dir: '#83a598',
            file: '#ebdbb2',
            exec: '#b8bb26',
            error: '#fb4934',
            success: '#b8bb26',
            warning: '#fabd2f',
            muted: '#928374'
        },
        nord: {
            name: 'Nord',
            background: '#2e3440',
            foreground: '#d8dee9',
            user: '#88c0d0',
            path: '#a3be8c',
            git: '#bf616a',
            time: '#b48ead',
            command: '#ebcb8b',
            dir: '#88c0d0',
            file: '#d8dee9',
            exec: '#a3be8c',
            error: '#bf616a',
            success: '#a3be8c',
            warning: '#ebcb8b',
            muted: '#4c566a'
        },
        solarized: {
            name: 'Solarized',
            background: '#002b36',
            foreground: '#839496',
            user: '#268bd2',
            path: '#859900',
            git: '#dc322f',
            time: '#6c71c4',
            command: '#b58900',
            dir: '#268bd2',
            file: '#839496',
            exec: '#859900',
            error: '#dc322f',
            success: '#859900',
            warning: '#b58900',
            muted: '#586e75'
        },
        'tokyo-night': {
            name: 'Tokyo Night',
            background: '#1a1b26',
            foreground: '#a9b1d6',
            user: '#7aa2f7',
            path: '#9ece6a',
            git: '#f7768e',
            time: '#bb9af7',
            command: '#e0af68',
            dir: '#7aa2f7',
            file: '#a9b1d6',
            exec: '#9ece6a',
            error: '#f7768e',
            success: '#9ece6a',
            warning: '#e0af68',
            muted: '#565f89'
        },
        catppuccin: {
            name: 'Catppuccin',
            background: '#1e1e2e',
            foreground: '#cdd6f4',
            user: '#89b4fa',
            path: '#a6e3a1',
            git: '#f38ba8',
            time: '#cba6f7',
            command: '#f9e2af',
            dir: '#89b4fa',
            file: '#cdd6f4',
            exec: '#a6e3a1',
            error: '#f38ba8',
            success: '#a6e3a1',
            warning: '#f9e2af',
            muted: '#6c7086'
        }
    },

    init() {
        // Check for shared URL config first
        if (this.loadFromUrl()) {
            this.showScreen('shell-selection');
            return;
        }

        // Check for saved config in localStorage
        this.checkSavedConfig();

        this.renderColorSchemes();
        this.updatePrompt();
    },

    // ==========================================
    // LOCAL STORAGE PERSISTENCE
    // ==========================================

    saveToLocalStorage() {
        try {
            const saveData = {
                config: this.config,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    },

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                return data;
            }
        } catch (e) {
            console.warn('Could not load from localStorage:', e);
        }
        return null;
    },

    checkSavedConfig() {
        const saved = this.loadFromLocalStorage();
        if (saved && saved.config && saved.config.shell) {
            const resumeSection = document.getElementById('resume-section');
            const savedDate = document.getElementById('saved-date');
            if (resumeSection && savedDate) {
                resumeSection.style.display = 'block';
                const date = new Date(saved.savedAt);
                savedDate.textContent = `Saved ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
            }
        }
    },

    resumeSavedConfig() {
        const saved = this.loadFromLocalStorage();
        if (saved && saved.config) {
            this.config = { ...this.config, ...saved.config };
            this.showScreen('shell-selection');

            // Restore UI state
            setTimeout(() => {
                // Set shell radio
                const shellRadio = document.querySelector(`input[name="shell"][value="${this.config.shell}"]`);
                if (shellRadio) shellRadio.checked = true;
                this.updateFrameworkVisibility();

                // Set framework radio
                if (this.config.framework) {
                    const frameworkRadio = document.querySelector(`input[name="framework"][value="${this.config.framework}"]`);
                    if (frameworkRadio) frameworkRadio.checked = true;
                }
            }, 100);
        }
    },

    clearSavedConfig() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            document.getElementById('resume-section').style.display = 'none';
        } catch (e) {
            console.warn('Could not clear localStorage:', e);
        }
    },

    // Auto-save on config changes
    autoSave() {
        this.saveToLocalStorage();
    },

    // ==========================================
    // URL SHARING
    // ==========================================

    generateShareUrl() {
        try {
            const shareData = {
                s: this.config.shell,
                f: this.config.framework,
                e: this.config.editor,
                p: {
                    u: this.config.prompt.showUser ? 1 : 0,
                    p: this.config.prompt.showPath ? 1 : 0,
                    g: this.config.prompt.showGit ? 1 : 0,
                    t: this.config.prompt.showTime ? 1 : 0,
                    c: this.config.prompt.colorScheme
                },
                a: this.config.aliases,
                ca: this.config.customAliases.map(a => ({ n: a.shortcut, c: a.command, d: a.desc })),
                st: {
                    ac: this.config.settings.autocorrect ? 1 : 0,
                    ci: this.config.settings.caseInsensitive ? 1 : 0,
                    ad: this.config.settings.autocd ? 1 : 0,
                    eg: this.config.settings.extendedGlob ? 1 : 0,
                    hs: this.config.settings.historyShare ? 1 : 0,
                    nl: this.config.settings.notifyLong ? 1 : 0,
                    hz: this.config.settings.historySize,
                    hi: this.config.settings.historyIgnore
                },
                pl: this.config.plugins
            };

            const encoded = btoa(JSON.stringify(shareData));
            return `${window.location.origin}${window.location.pathname}?c=${encoded}`;
        } catch (e) {
            console.warn('Could not generate share URL:', e);
            return window.location.href;
        }
    },

    loadFromUrl() {
        try {
            const params = new URLSearchParams(window.location.search);
            const configParam = params.get('c');

            if (configParam) {
                const shareData = JSON.parse(atob(configParam));

                this.config.shell = shareData.s || 'bash';
                this.config.framework = shareData.f || 'none';
                this.config.editor = shareData.e || null;

                if (shareData.p) {
                    this.config.prompt = {
                        showUser: shareData.p.u === 1,
                        showPath: shareData.p.p === 1,
                        showGit: shareData.p.g === 1,
                        showTime: shareData.p.t === 1,
                        colorScheme: shareData.p.c || 'default'
                    };
                }

                if (shareData.a) {
                    this.config.aliases = shareData.a;
                }

                if (shareData.ca) {
                    this.config.customAliases = shareData.ca.map(a => ({
                        id: `custom-${Date.now()}-${Math.random()}`,
                        shortcut: a.n,
                        command: a.c,
                        desc: a.d
                    }));
                }

                if (shareData.st) {
                    this.config.settings = {
                        autocorrect: shareData.st.ac === 1,
                        caseInsensitive: shareData.st.ci === 1,
                        autocd: shareData.st.ad === 1,
                        extendedGlob: shareData.st.eg === 1,
                        historyShare: shareData.st.hs === 1,
                        notifyLong: shareData.st.nl === 1,
                        historySize: shareData.st.hz || 10000,
                        historyIgnore: shareData.st.hi || 'duplicates'
                    };
                }

                if (shareData.pl) {
                    this.config.plugins = shareData.pl;
                }

                // Clean URL
                window.history.replaceState({}, '', window.location.pathname);
                return true;
            }
        } catch (e) {
            console.warn('Could not load from URL:', e);
        }
        return false;
    },

    copyShareUrl() {
        const urlInput = document.getElementById('share-url');
        urlInput.select();
        navigator.clipboard.writeText(urlInput.value).then(() => {
            const btn = urlInput.nextElementSibling;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    },

    // ==========================================
    // FRAMEWORK SELECTION
    // ==========================================

    updateFrameworkVisibility() {
        const shell = document.querySelector('input[name="shell"]:checked')?.value || 'bash';

        // Show/hide relevant framework options based on shell
        const ohmyzshOption = document.getElementById('ohmyzsh-option');
        const ohmybashOption = document.getElementById('ohmybash-option');
        const fisherOption = document.getElementById('fisher-option');

        if (ohmyzshOption) ohmyzshOption.style.display = shell === 'zsh' ? 'block' : 'none';
        if (ohmybashOption) ohmybashOption.style.display = shell === 'bash' ? 'block' : 'none';
        if (fisherOption) fisherOption.style.display = shell === 'fish' ? 'block' : 'none';

        // Reset framework to 'none' or 'starship' if current selection is hidden
        const currentFramework = document.querySelector('input[name="framework"]:checked')?.value;
        if ((currentFramework === 'ohmyzsh' && shell !== 'zsh') ||
            (currentFramework === 'ohmybash' && shell !== 'bash') ||
            (currentFramework === 'fisher' && shell !== 'fish')) {
            document.querySelector('input[name="framework"][value="none"]').checked = true;
        }
    },

    updateFrameworkSelection() {
        const framework = document.querySelector('input[name="framework"]:checked')?.value || 'none';
        this.config.framework = framework;
        this.autoSave();
    },

    // Render color scheme selector cards
    renderColorSchemes() {
        const container = document.getElementById('color-schemes-grid');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(this.colorSchemes).forEach(([schemeId, scheme]) => {
            const isSelected = this.config.prompt.colorScheme === schemeId;

            const card = document.createElement('label');
            card.className = `color-scheme-card ${isSelected ? 'selected' : ''}`;
            card.dataset.scheme = schemeId;

            card.innerHTML = `
                <input type="radio" name="color-scheme" value="${schemeId}" ${isSelected ? 'checked' : ''}>
                <div class="scheme-mini-preview theme-${schemeId}">
                    <span class="mini-prompt">
                        <span style="color: ${scheme.user}">user</span>
                        <span style="color: ${scheme.muted}">@host</span>
                        <span style="color: ${scheme.foreground}"> </span>
                        <span style="color: ${scheme.path}">~/code</span>
                        <span style="color: ${scheme.foreground}"> </span>
                        <span style="color: ${scheme.git}">(main)</span>
                        <span style="color: ${scheme.foreground}"> $ </span>
                        <span style="color: ${scheme.command}">git status</span>
                    </span>
                </div>
                <div class="scheme-info">
                    <span class="scheme-name">${scheme.name}</span>
                    <span class="scheme-check">✓</span>
                </div>
            `;

            card.addEventListener('click', () => {
                this.selectColorScheme(schemeId);
            });

            container.appendChild(card);
        });
    },

    selectColorScheme(schemeId) {
        // Update radio button
        const radio = document.querySelector(`input[name="color-scheme"][value="${schemeId}"]`);
        if (radio) radio.checked = true;

        // Update selected state on cards
        document.querySelectorAll('.color-scheme-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.scheme === schemeId);
        });

        // Update config and re-render terminal
        this.config.prompt.colorScheme = schemeId;
        this.updatePrompt();
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        this.currentStep = screenId;

        // Handle screen-specific setup
        if (screenId === 'shell-selection') {
            this.setupShellSelection();
        }
    },

    setupShellSelection() {
        // Update framework visibility based on shell selection
        this.updateFrameworkVisibility();

        // Add change listeners to shell radios
        document.querySelectorAll('input[name="shell"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateFrameworkVisibility());
        });
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
        input.accept = '.bash_profile,.bashrc,.zshrc,.vimrc,.emacs,config.fish,.config/fish/config.fish';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                this.parseExistingConfig(event.target.result, file.name);
                this.showScreen('shell-selection');
            };
            reader.readAsText(file);
        };
        input.click();
    },

    // ==========================================
    // IMPROVED CONFIG IMPORT PARSING
    // ==========================================

    parseExistingConfig(content, filename = '') {
        // Detect shell from filename or content
        if (filename.includes('fish') || content.includes('set -gx') || content.includes('function ') && content.includes('end')) {
            this.config.shell = 'fish';
        } else if (filename.includes('zsh') || content.includes('PROMPT=') || content.includes('setopt') || content.includes('autoload')) {
            this.config.shell = 'zsh';
        } else if (content.includes('PS1=') || content.includes('shopt')) {
            this.config.shell = 'bash';
        }

        // Detect framework
        if (content.includes('oh-my-zsh') || content.includes('ZSH_THEME')) {
            this.config.framework = 'ohmyzsh';
        } else if (content.includes('oh-my-bash') || content.includes('OSH_THEME')) {
            this.config.framework = 'ohmybash';
        } else if (content.includes('starship init')) {
            this.config.framework = 'starship';
        } else if (content.includes('fisher')) {
            this.config.framework = 'fisher';
        }

        // Parse aliases
        const aliasMatches = content.matchAll(/alias\s+([a-zA-Z0-9_-]+)=['"]([^'"]+)['"]/g);
        for (const match of aliasMatches) {
            const shortcut = match[1];
            const command = match[2];

            // Check if this is a preset alias
            let found = false;
            for (const category of Object.values(this.aliasCategories)) {
                const preset = category.aliases.find(a => a.shortcut === shortcut);
                if (preset && !this.config.aliases.includes(preset.id)) {
                    this.config.aliases.push(preset.id);
                    found = true;
                    break;
                }
            }

            // If not a preset, add as custom
            if (!found && shortcut && command) {
                const existing = this.config.customAliases.find(a => a.shortcut === shortcut);
                if (!existing) {
                    this.config.customAliases.push({
                        id: `custom-import-${Date.now()}-${Math.random()}`,
                        shortcut,
                        command,
                        desc: 'Imported alias'
                    });
                }
            }
        }

        // Parse editor
        const editorMatch = content.match(/export\s+EDITOR=['"]?([a-z]+)['"]?/i);
        if (editorMatch) {
            const editor = editorMatch[1].toLowerCase();
            if (['vim', 'neovim', 'nvim', 'emacs', 'nano', 'code', 'vscode'].includes(editor)) {
                this.config.editor = editor === 'nvim' ? 'neovim' : editor === 'code' ? 'vscode' : editor;
            }
        }

        // Parse history size
        const histSizeMatch = content.match(/(?:export\s+)?HISTSIZE=(\d+)/);
        if (histSizeMatch) {
            this.config.settings.historySize = parseInt(histSizeMatch[1]);
        }

        // Detect prompt settings from PS1/PROMPT
        if (content.includes('\\u') || content.includes('%n')) {
            this.config.prompt.showUser = true;
        }
        if (content.includes('\\w') || content.includes('%~')) {
            this.config.prompt.showPath = true;
        }
        if (content.includes('git') || content.includes('vcs_info')) {
            this.config.prompt.showGit = true;
        }
        if (content.includes('\\t') || content.includes('%T') || content.includes('%*')) {
            this.config.prompt.showTime = true;
        }

        // Save parsed config
        this.autoSave();
    },

    nextStep() {
        const steps = ['shell-selection', 'editor-selection', 'prompt-customization', 'alias-builder', 'plugins-selection'];
        const currentIndex = steps.indexOf(this.currentStep);

        if (this.currentStep === 'shell-selection') {
            this.config.shell = document.querySelector('input[name="shell"]:checked').value;
            this.config.framework = document.querySelector('input[name="framework"]:checked')?.value || 'none';
            this.autoSave();
        } else if (this.currentStep === 'editor-selection') {
            const selectedEditor = document.querySelector('input[name="editor"]:checked');
            if (!selectedEditor) {
                alert('Please select an editor');
                return;
            }
            this.config.editor = selectedEditor.value;
            this.autoSave();
        } else if (this.currentStep === 'prompt-customization') {
            // Load alias builder when moving to it
            this.autoSave();
            this.loadAliasBuilder();
        } else if (this.currentStep === 'alias-builder') {
            // Save settings before moving on
            this.saveAliasSettings();
            this.autoSave();
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

        this.renderTerminalPreview();
    },

    // Build prompt HTML based on current settings
    buildPromptHTML(colors, options = {}) {
        const { showUser, showPath, showGit, showTime } = { ...this.config.prompt, ...options };
        const path = options.path || '~/projects/my-app';
        const branch = options.branch || 'main';

        let html = '<span class="term-prompt">';

        if (showTime) {
            html += `<span class="time" style="color: ${colors.time}">[18:52]</span> `;
        }
        if (showUser) {
            html += `<span class="user" style="color: ${colors.user}">user</span>`;
            html += `<span style="color: ${colors.muted}">@hostname</span>`;
        }
        if (showPath) {
            html += ` <span class="path" style="color: ${colors.path}">${path}</span>`;
        }
        if (showGit) {
            html += ` <span class="git" style="color: ${colors.git}">(${branch})</span>`;
        }
        html += `<span class="symbol" style="color: ${colors.foreground}"> $ </span>`;
        html += '</span>';

        return html;
    },

    // Render the full themed terminal preview
    renderTerminalPreview() {
        const terminalWindow = document.getElementById('terminal-window');
        const terminalBody = document.getElementById('terminal-body');

        if (!terminalWindow || !terminalBody) return;

        const colorScheme = this.config.prompt.colorScheme;
        const colors = this.colorSchemes[colorScheme];

        // Update terminal window theme class
        terminalWindow.className = `terminal-window theme-${colorScheme}`;

        // Build terminal content with sample commands and output
        const content = this.generateTerminalContent(colors);
        terminalBody.innerHTML = content;
    },

    generateTerminalContent(colors) {
        let html = '';

        // Command 1: ls -la
        html += `<div class="term-line command-line">`;
        html += this.buildPromptHTML(colors, { path: '~/projects/my-app', branch: 'main' });
        html += `<span class="term-command" style="color: ${colors.command}">ls -la</span>`;
        html += `</div>`;

        // Output for ls -la
        html += `<div class="term-line"><span class="term-output" style="color: ${colors.foreground}">`;
        html += `<span style="color: ${colors.muted}">total 48</span></span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `<span style="color: ${colors.muted}">drwxr-xr-x</span>  `;
        html += `<span style="color: ${colors.dir}">.</span>`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `<span style="color: ${colors.muted}">drwxr-xr-x</span>  `;
        html += `<span style="color: ${colors.dir}">..</span>`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `<span style="color: ${colors.muted}">drwxr-xr-x</span>  `;
        html += `<span style="color: ${colors.dir}">.git</span>`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `<span style="color: ${colors.muted}">-rw-r--r--</span>  `;
        html += `<span style="color: ${colors.exec}">package.json</span>`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `<span style="color: ${colors.muted}">drwxr-xr-x</span>  `;
        html += `<span style="color: ${colors.dir}">src</span>`;
        html += `</span></div>`;

        // Command 2: git status
        html += `<div class="term-line command-line">`;
        html += this.buildPromptHTML(colors, { path: '~/projects/my-app', branch: 'main' });
        html += `<span class="term-command" style="color: ${colors.command}">git status</span>`;
        html += `</div>`;

        // Output for git status
        html += `<div class="term-line"><span class="term-output">`;
        html += `<span style="color: ${colors.foreground}">On branch </span>`;
        html += `<span style="color: ${colors.git}">main</span>`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output" style="color: ${colors.foreground}">`;
        html += `Changes not staged for commit:`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `  <span style="color: ${colors.warning}">modified:</span>   `;
        html += `<span style="color: ${colors.foreground}">src/app.js</span>`;
        html += `</span></div>`;

        html += `<div class="term-line"><span class="term-output">`;
        html += `  <span style="color: ${colors.success}">new file:</span>   `;
        html += `<span style="color: ${colors.foreground}">src/utils.js</span>`;
        html += `</span></div>`;

        // Command 3: Current prompt with cursor
        html += `<div class="term-line command-line">`;
        html += this.buildPromptHTML(colors, { path: '~/projects/my-app', branch: 'main' });
        html += `<span class="term-cursor" style="background: ${colors.foreground}"></span>`;
        html += `</div>`;

        return html;
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

        // Update filename based on shell
        const filenames = {
            bash: '.bash_profile',
            zsh: '.zshrc',
            fish: 'config.fish'
        };
        const filename = filenames[this.config.shell] || '.bash_profile';
        document.getElementById('config-filename').textContent = filename;
        document.getElementById('main-tab-name').textContent = filename;

        // Handle Starship config
        const starshipTab = document.getElementById('starship-tab');
        const downloadStarshipBtn = document.getElementById('download-starship-btn');

        if (this.config.framework === 'starship') {
            this.starshipConfig = this.buildStarshipConfig();
            starshipTab.style.display = 'block';
            downloadStarshipBtn.style.display = 'inline-block';
        } else {
            starshipTab.style.display = 'none';
            downloadStarshipBtn.style.display = 'none';
        }

        // Generate share URL
        const shareUrl = this.generateShareUrl();
        document.getElementById('share-url').value = shareUrl;

        // Update installation steps
        this.updateInstallSteps();

        // Final save
        this.autoSave();

        this.showScreen('export-screen');
    },

    switchConfigTab(tabName) {
        this.currentConfigTab = tabName;

        // Update tab styles
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.file === tabName);
        });

        // Update content
        const contentEl = document.getElementById('config-content');
        const filenameEl = document.getElementById('config-filename');

        if (tabName === 'starship') {
            contentEl.textContent = this.starshipConfig;
            filenameEl.textContent = 'starship.toml';
        } else {
            contentEl.textContent = this.buildConfigFile();
            const filenames = { bash: '.bash_profile', zsh: '.zshrc', fish: 'config.fish' };
            filenameEl.textContent = filenames[this.config.shell] || '.bash_profile';
        }
    },

    downloadStarshipConfig() {
        const content = this.starshipConfig;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'starship.toml';
        a.click();
        window.URL.revokeObjectURL(url);
    },

    buildStarshipConfig() {
        const { prompt } = this.config;
        const colors = this.colorSchemes[prompt.colorScheme];

        let config = '# Starship Configuration\n';
        config += '# Generated by terminal-tweaker\n';
        config += '# Place in ~/.config/starship.toml\n\n';

        config += '# Prompt format\n';
        config += 'format = """';

        if (prompt.showTime) {
            config += '$time';
        }
        if (prompt.showUser) {
            config += '$username$hostname';
        }
        if (prompt.showPath) {
            config += '$directory';
        }
        if (prompt.showGit) {
            config += '$git_branch$git_status';
        }
        config += '$character"""\n\n';

        // Time module
        if (prompt.showTime) {
            config += '[time]\n';
            config += 'disabled = false\n';
            config += `style = "${colors.time}"\n`;
            config += 'format = "[$time]($style) "\n\n';
        }

        // Username
        if (prompt.showUser) {
            config += '[username]\n';
            config += 'show_always = true\n';
            config += `style_user = "${colors.user}"\n`;
            config += 'format = "[$user]($style_user)"\n\n';

            config += '[hostname]\n';
            config += 'ssh_only = false\n';
            config += 'style = "dimmed white"\n';
            config += 'format = "[@$hostname]($style) "\n\n';
        }

        // Directory
        if (prompt.showPath) {
            config += '[directory]\n';
            config += `style = "${colors.path}"\n`;
            config += 'truncation_length = 3\n';
            config += 'truncate_to_repo = true\n\n';
        }

        // Git branch
        if (prompt.showGit) {
            config += '[git_branch]\n';
            config += `style = "${colors.git}"\n`;
            config += 'format = "[($branch)]($style) "\n\n';

            config += '[git_status]\n';
            config += 'style = "bold yellow"\n\n';
        }

        // Character (prompt symbol)
        config += '[character]\n';
        config += 'success_symbol = "[\\$](bold green)"\n';
        config += 'error_symbol = "[\\$](bold red)"\n';

        return config;
    },

    buildFishConfig() {
        const { editor, prompt, aliases, customAliases, settings } = this.config;
        const colors = this.colorSchemes[prompt.colorScheme];

        let config = '# Fish Shell Configuration\n';
        config += '# Generated by terminal-tweaker\n';
        config += `# Date: ${new Date().toLocaleDateString()}\n`;
        config += '# Save this file to ~/.config/fish/config.fish\n\n';

        // Editor configuration
        config += '# Editor Configuration\n';
        config += `set -gx EDITOR "${editor}"\n`;
        config += `set -gx VISUAL "${editor}"\n\n`;

        // History configuration
        config += '# History Configuration\n';
        config += `set -g fish_history_size ${settings.historySize}\n\n`;

        // Custom prompt function
        if (this.config.framework !== 'starship') {
            config += '# Custom Prompt\n';
            config += 'function fish_prompt\n';

            if (prompt.showTime) {
                config += '    set_color magenta\n';
                config += '    echo -n "["(date "+%H:%M:%S")"] "\n';
            }

            if (prompt.showUser) {
                config += '    set_color blue\n';
                config += '    echo -n (whoami)"@"(hostname -s)" "\n';
            }

            if (prompt.showPath) {
                config += '    set_color green\n';
                config += '    echo -n (prompt_pwd)" "\n';
            }

            if (prompt.showGit) {
                config += '    # Git branch\n';
                config += '    set -l git_branch (git branch 2>/dev/null | sed -n \'/\\* /s///p\')\n';
                config += '    if test -n "$git_branch"\n';
                config += '        set_color red\n';
                config += '        echo -n "($git_branch) "\n';
                config += '    end\n';
            }

            config += '    set_color normal\n';
            config += '    echo -n "$ "\n';
            config += 'end\n\n';
        } else {
            config += '# Initialize Starship prompt\n';
            config += 'starship init fish | source\n\n';
        }

        // Aliases (Fish uses abbr or functions)
        config += '# ==========================================\n';
        config += '# ABBREVIATIONS & ALIASES\n';
        config += '# ==========================================\n\n';

        // Group aliases by category
        Object.entries(this.aliasCategories).forEach(([, category]) => {
            const selectedAliases = category.aliases.filter(a => aliases.includes(a.id));

            if (selectedAliases.length > 0) {
                config += `# ${category.name}\n`;

                selectedAliases.forEach(alias => {
                    if (alias.command.startsWith('function ')) {
                        // Convert bash function to fish function
                        const fnMatch = alias.command.match(/function\s+\w+\(\)\s*\{(.+)\}/);
                        if (fnMatch) {
                            config += `function ${alias.shortcut}\n`;
                            config += `    ${fnMatch[1].trim().replace(/;/g, '\n    ')}\n`;
                            config += 'end\n';
                        }
                    } else if (alias.command.includes('cd ')) {
                        // Navigation aliases work as abbreviations
                        config += `abbr -a ${alias.shortcut} '${alias.command}'\n`;
                    } else {
                        config += `abbr -a ${alias.shortcut} '${alias.command}'\n`;
                    }
                });
                config += '\n';
            }
        });

        // Custom aliases
        if (customAliases.length > 0) {
            config += '# Custom Aliases\n';
            customAliases.forEach(alias => {
                config += `abbr -a ${alias.shortcut} '${alias.command}'\n`;
            });
            config += '\n';
        }

        // Fish-specific features
        config += '# Fish Features\n';
        if (settings.caseInsensitive) {
            config += '# Case-insensitive completion (default in Fish)\n';
        }

        // Color support
        config += '\n# Enable color support\n';
        config += 'set -gx CLICOLOR 1\n';

        return config;
    },

    buildOhMyZshConfig() {
        const { editor, prompt, aliases, customAliases, settings } = this.config;
        const colors = this.colorSchemes[prompt.colorScheme];

        let config = '#!/bin/zsh\n';
        config += '# Oh-My-Zsh Configuration\n';
        config += '# Generated by terminal-tweaker\n';
        config += `# Date: ${new Date().toLocaleDateString()}\n\n`;

        // Oh-My-Zsh setup
        config += '# Path to Oh-My-Zsh installation\n';
        config += 'export ZSH="$HOME/.oh-my-zsh"\n\n';

        // Theme selection
        config += '# Theme Configuration\n';
        if (prompt.colorScheme === 'default') {
            config += 'ZSH_THEME="robbyrussell"\n\n';
        } else {
            config += `# Using ${prompt.colorScheme} color scheme\n`;
            config += 'ZSH_THEME="agnoster"  # Works well with custom colors\n\n';
        }

        // Plugins
        config += '# Plugins\n';
        config += 'plugins=(\n';
        config += '    git\n';
        if (settings.autocorrect) {
            config += '    zsh-autosuggestions\n';
        }
        config += '    z\n';
        config += '    colored-man-pages\n';
        config += ')\n\n';

        config += 'source $ZSH/oh-my-zsh.sh\n\n';

        // Editor
        config += '# Editor Configuration\n';
        config += `export EDITOR="${editor}"\n`;
        config += `export VISUAL="${editor}"\n\n`;

        // History
        config += '# History Configuration\n';
        config += `HISTSIZE=${settings.historySize}\n`;
        config += `SAVEHIST=${settings.historySize}\n`;
        if (settings.historyIgnore === 'duplicates' || settings.historyIgnore === 'both') {
            config += 'setopt HIST_IGNORE_DUPS\n';
        }
        config += '\n';

        // Aliases
        config += '# ==========================================\n';
        config += '# CUSTOM ALIASES\n';
        config += '# ==========================================\n\n';

        Object.entries(this.aliasCategories).forEach(([, category]) => {
            const selectedAliases = category.aliases.filter(a => aliases.includes(a.id));

            if (selectedAliases.length > 0) {
                config += `# ${category.name}\n`;
                selectedAliases.forEach(alias => {
                    if (!alias.command.startsWith('function ')) {
                        config += `alias ${alias.shortcut}="${alias.command}"\n`;
                    }
                });
                config += '\n';
            }
        });

        if (customAliases.length > 0) {
            config += '# Custom Aliases\n';
            customAliases.forEach(alias => {
                config += `alias ${alias.shortcut}="${alias.command}"\n`;
            });
            config += '\n';
        }

        return config;
    },

    buildOhMyBashConfig() {
        const { editor, prompt, aliases, customAliases, settings } = this.config;

        let config = '#!/bin/bash\n';
        config += '# Oh-My-Bash Configuration\n';
        config += '# Generated by terminal-tweaker\n';
        config += `# Date: ${new Date().toLocaleDateString()}\n\n`;

        // Oh-My-Bash setup
        config += '# Path to Oh-My-Bash installation\n';
        config += 'export OSH="$HOME/.oh-my-bash"\n\n';

        // Theme
        config += '# Theme Configuration\n';
        config += 'OSH_THEME="powerline"\n\n';

        // Plugins
        config += '# Plugins\n';
        config += 'plugins=(\n';
        config += '    git\n';
        config += '    bashmarks\n';
        config += ')\n\n';

        // Aliases
        config += 'aliases=(\n';
        config += '    general\n';
        config += ')\n\n';

        // Completions
        config += 'completions=(\n';
        config += '    git\n';
        config += '    ssh\n';
        config += ')\n\n';

        config += 'source "$OSH/oh-my-bash.sh"\n\n';

        // Editor
        config += '# Editor Configuration\n';
        config += `export EDITOR="${editor}"\n`;
        config += `export VISUAL="${editor}"\n\n`;

        // History
        config += '# History Configuration\n';
        config += `export HISTSIZE=${settings.historySize}\n`;
        config += `export HISTFILESIZE=${settings.historySize * 2}\n`;
        if (settings.historyIgnore === 'duplicates') {
            config += 'export HISTCONTROL=ignoredups:erasedups\n';
        }
        config += '\n';

        // Aliases
        config += '# ==========================================\n';
        config += '# CUSTOM ALIASES\n';
        config += '# ==========================================\n\n';

        Object.entries(this.aliasCategories).forEach(([, category]) => {
            const selectedAliases = category.aliases.filter(a => aliases.includes(a.id));

            if (selectedAliases.length > 0) {
                config += `# ${category.name}\n`;
                selectedAliases.forEach(alias => {
                    if (!alias.command.startsWith('function ')) {
                        config += `alias ${alias.shortcut}="${alias.command}"\n`;
                    }
                });
                config += '\n';
            }
        });

        if (customAliases.length > 0) {
            config += '# Custom Aliases\n';
            customAliases.forEach(alias => {
                config += `alias ${alias.shortcut}="${alias.command}"\n`;
            });
            config += '\n';
        }

        return config;
    },

    buildConfigFile() {
        const { shell, framework, editor, prompt, plugins, aliases, customAliases, settings } = this.config;
        const colors = this.colorSchemes[prompt.colorScheme];

        // Fish shell has completely different syntax
        if (shell === 'fish') {
            return this.buildFishConfig();
        }

        // Handle framework-specific configs
        if (framework === 'ohmyzsh') {
            return this.buildOhMyZshConfig();
        } else if (framework === 'ohmybash') {
            return this.buildOhMyBashConfig();
        }

        let config = shell === 'bash' ? '#!/bin/bash\n' : '#!/bin/zsh\n';
        config += '# Generated by terminal-tweaker\n';
        config += `# Date: ${new Date().toLocaleDateString()}\n\n`;

        // Add Starship init if using Starship
        if (framework === 'starship') {
            config += '# Initialize Starship prompt\n';
            if (shell === 'bash') {
                config += 'eval "$(starship init bash)"\n\n';
            } else {
                config += 'eval "$(starship init zsh)"\n\n';
            }
        }

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
        } else if (shell === 'bash') {
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

        // Build prompt (skip if using Starship)
        if (framework !== 'starship') {
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
        const { shell, framework, editor } = this.config;

        // Determine the correct filename
        let filename, filepath;
        if (shell === 'fish') {
            filename = 'config.fish';
            filepath = '~/.config/fish/config.fish';
        } else if (shell === 'bash') {
            filename = '.bash_profile';
            filepath = '~/.bash_profile';
        } else {
            filename = '.zshrc';
            filepath = '~/.zshrc';
        }

        let steps = '';

        // Framework-specific installation
        if (framework === 'ohmyzsh') {
            steps += `<li><strong>Install Oh-My-Zsh first:</strong><br><code>sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"</code></li>`;
            steps += `<li>Download the configuration file using the button below</li>`;
            steps += `<li>Replace your .zshrc: <code>mv ~/Downloads/${filename} ${filepath}</code></li>`;
            steps += `<li>Install recommended plugins:<br>
                <code>git clone https://github.com/zsh-users/zsh-autosuggestions \${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions</code></li>`;
        } else if (framework === 'ohmybash') {
            steps += `<li><strong>Install Oh-My-Bash first:</strong><br><code>bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"</code></li>`;
            steps += `<li>Download the configuration file using the button below</li>`;
            steps += `<li>Replace your .bashrc: <code>mv ~/Downloads/${filename} ~/.bashrc</code></li>`;
        } else if (framework === 'starship') {
            steps += `<li><strong>Install Starship first:</strong><br><code>curl -sS https://starship.rs/install.sh | sh</code></li>`;
            steps += `<li>Download the shell configuration file</li>`;
            steps += `<li>Move it to your home directory: <code>mv ~/Downloads/${filename} ${filepath}</code></li>`;
            steps += `<li>Download the Starship config (starship.toml) and move it:<br><code>mv ~/Downloads/starship.toml ~/.config/starship.toml</code></li>`;
        } else if (framework === 'fisher' && shell === 'fish') {
            steps += `<li><strong>Install Fisher (Fish plugin manager):</strong><br><code>curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher</code></li>`;
            steps += `<li>Download the configuration file</li>`;
            steps += `<li>Create config directory if needed: <code>mkdir -p ~/.config/fish</code></li>`;
            steps += `<li>Move config: <code>mv ~/Downloads/${filename} ${filepath}</code></li>`;
        } else if (shell === 'fish') {
            steps += `<li>Download the configuration file</li>`;
            steps += `<li>Create config directory: <code>mkdir -p ~/.config/fish</code></li>`;
            steps += `<li>Move it: <code>mv ~/Downloads/${filename} ${filepath}</code></li>`;
            steps += `<li>Restart Fish or open a new terminal</li>`;
        } else {
            steps += `<li>Download the configuration file using the button below</li>`;
            steps += `<li>Move it to your home directory: <code>mv ~/Downloads/${filename} ${filepath}</code></li>`;
            steps += `<li>Reload your shell: <code>source ${filepath}</code></li>`;
        }

        // Editor-specific steps
        if (editor === 'vim' || editor === 'neovim') {
            steps += `<li>Install vim-plug for plugin management:<br><code>curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim</code></li>`;
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
        const { shell, framework } = this.config;

        // Determine the correct filename
        let filename;
        if (shell === 'fish') {
            filename = 'config.fish';
        } else if (framework === 'ohmybash') {
            filename = '.bashrc';
        } else if (shell === 'bash') {
            filename = '.bash_profile';
        } else {
            filename = '.zshrc';
        }

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
            framework: 'none',
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
    },

    goHome() {
        this.showScreen('onboarding');
    },

    showFeatures() {
        const modal = document.getElementById('features-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Close on escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.hideFeatures();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }
    },

    hideFeatures() {
        const modal = document.getElementById('features-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Easter egg - call terminalTweaker() in console to activate
function terminalTweaker() {
    const asciiArt = `
 ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
 ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
    ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝

 ████████╗██╗    ██╗███████╗ █████╗ ██╗  ██╗███████╗██████╗
 ╚══██╔══╝██║    ██║██╔════╝██╔══██╗██║ ██╔╝██╔════╝██╔══██╗
    ██║   ██║ █╗ ██║█████╗  ███████║█████╔╝ █████╗  ██████╔╝
    ██║   ██║███╗██║██╔══╝  ██╔══██║██╔═██╗ ██╔══╝  ██╔══██╗
    ██║   ╚███╔███╔╝███████╗██║  ██║██║  ██╗███████╗██║  ██║
    ╚═╝    ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
`;

    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'easter-egg-modal';
    modal.innerHTML = `
        <div class="ee-backdrop"></div>
        <div class="ee-content">
            <div class="ee-close" onclick="closeEasterEgg()">&times;</div>
            <div class="ee-scanlines"></div>
            <div class="ee-glitch-container">
                <pre class="ee-ascii" data-text="${asciiArt.replace(/"/g, '&quot;')}">${asciiArt}</pre>
            </div>
            <div class="ee-gif-container">
                <img src="img/terminal.gif" alt="Terminal" class="ee-gif" onerror="this.style.display='none'">
            </div>
            <div class="ee-particles"></div>
            <div class="ee-message">You found the secret!</div>
        </div>
    `;

    // Create particles
    const particlesContainer = modal.querySelector('.ee-particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'ee-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        particlesContainer.appendChild(particle);
    }

    // Add styles
    const styles = document.createElement('style');
    styles.id = 'easter-egg-styles';
    styles.textContent = `
        #easter-egg-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .ee-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            animation: ee-fade-in 0.3s ease;
        }

        .ee-content {
            position: relative;
            text-align: center;
            padding: 2rem;
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
        }

        .ee-close {
            position: absolute;
            top: -20px;
            right: -20px;
            font-size: 2rem;
            color: #fff;
            cursor: pointer;
            z-index: 10;
            transition: transform 0.2s, color 0.2s;
        }

        .ee-close:hover {
            transform: scale(1.2);
            color: #ffc600;
        }

        .ee-scanlines {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            animation: ee-scanline-move 8s linear infinite;
        }

        .ee-glitch-container {
            position: relative;
            animation: ee-float 3s ease-in-out infinite;
        }

        .ee-ascii {
            font-family: 'IBM Plex Mono', 'Courier New', monospace;
            font-size: clamp(0.3rem, 1.2vw, 0.7rem);
            line-height: 1.1;
            color: #ffc600;
            text-shadow:
                0 0 5px #ffc600,
                0 0 10px #ffc600,
                0 0 20px #ffc600,
                0 0 40px #ff8800;
            white-space: pre;
            animation: ee-glow 2s ease-in-out infinite alternate, ee-glitch 0.3s infinite;
            position: relative;
        }

        .ee-ascii::before,
        .ee-ascii::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.8;
        }

        .ee-ascii::before {
            color: #ff0080;
            animation: ee-glitch-1 0.2s infinite;
            clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }

        .ee-ascii::after {
            color: #00ffff;
            animation: ee-glitch-2 0.3s infinite;
            clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }

        .ee-gif-container {
            margin-top: 2rem;
            animation: ee-bounce 0.5s ease infinite alternate;
        }

        .ee-gif {
            max-width: 300px;
            border-radius: 8px;
            box-shadow:
                0 0 20px rgba(255, 198, 0, 0.5),
                0 0 40px rgba(255, 198, 0, 0.3);
            animation: ee-rotate-hue 5s linear infinite;
        }

        .ee-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        }

        .ee-particle {
            position: absolute;
            bottom: -20px;
            width: 8px;
            height: 8px;
            background: #ffc600;
            border-radius: 50%;
            animation: ee-particle-rise 3s ease-in infinite;
            box-shadow: 0 0 10px #ffc600;
        }

        .ee-particle:nth-child(odd) {
            background: #ff0080;
            box-shadow: 0 0 10px #ff0080;
        }

        .ee-particle:nth-child(3n) {
            background: #00ffff;
            box-shadow: 0 0 10px #00ffff;
        }

        .ee-message {
            margin-top: 2rem;
            font-size: 1.5rem;
            color: #00ff00;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            animation: ee-blink 1s step-end infinite, ee-rainbow 3s linear infinite;
        }

        @keyframes ee-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes ee-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes ee-glow {
            from { text-shadow: 0 0 5px #ffc600, 0 0 10px #ffc600, 0 0 20px #ffc600; }
            to { text-shadow: 0 0 10px #ffc600, 0 0 20px #ffc600, 0 0 40px #ffc600, 0 0 80px #ff8800; }
        }

        @keyframes ee-glitch {
            0%, 90%, 100% { transform: translate(0); }
            92% { transform: translate(-2px, 1px); }
            94% { transform: translate(2px, -1px); }
            96% { transform: translate(-1px, 2px); }
            98% { transform: translate(1px, -2px); }
        }

        @keyframes ee-glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-3px, 0); }
            40% { transform: translate(3px, 0); }
            60% { transform: translate(-2px, 0); }
            80% { transform: translate(2px, 0); }
        }

        @keyframes ee-glitch-2 {
            0%, 100% { transform: translate(0); }
            25% { transform: translate(2px, 0); }
            50% { transform: translate(-3px, 0); }
            75% { transform: translate(1px, 0); }
        }

        @keyframes ee-bounce {
            from { transform: scale(1); }
            to { transform: scale(1.02); }
        }

        @keyframes ee-rotate-hue {
            from { filter: hue-rotate(0deg); }
            to { filter: hue-rotate(360deg); }
        }

        @keyframes ee-particle-rise {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }

        @keyframes ee-scanline-move {
            from { background-position: 0 0; }
            to { background-position: 0 100%; }
        }

        @keyframes ee-blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.7; }
        }

        @keyframes ee-rainbow {
            0% { color: #ff0000; }
            16% { color: #ff8800; }
            33% { color: #ffff00; }
            50% { color: #00ff00; }
            66% { color: #00ffff; }
            83% { color: #ff00ff; }
            100% { color: #ff0000; }
        }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(modal);

    // Play sound effect (optional - console beep)
    console.log('%c🎉 EASTER EGG ACTIVATED! 🎉', 'font-size: 24px; color: #ffc600; text-shadow: 0 0 10px #ffc600;');
    console.log('%cYou discovered the terminal-tweaker secret mode!', 'font-size: 14px; color: #00ff00;');

    // Close on escape key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeEasterEgg();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Close on backdrop click
    modal.querySelector('.ee-backdrop').addEventListener('click', closeEasterEgg);
}

function closeEasterEgg() {
    const modal = document.getElementById('easter-egg-modal');
    const styles = document.getElementById('easter-egg-styles');
    if (modal) {
        modal.style.animation = 'ee-fade-out 0.3s ease forwards';
        setTimeout(() => {
            modal.remove();
            if (styles) styles.remove();
        }, 300);
    }
}

// Add fade out animation dynamically
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = '@keyframes ee-fade-out { to { opacity: 0; } }';
document.head.appendChild(fadeOutStyle);
