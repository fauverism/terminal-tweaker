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
        plugins: []
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
        const steps = ['shell-selection', 'editor-selection', 'prompt-customization', 'plugins-selection'];
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
            this.loadPlugins();
        }

        if (currentIndex < steps.length - 1) {
            this.showScreen(steps[currentIndex + 1]);
        }
    },

    prevStep() {
        const steps = ['shell-selection', 'editor-selection', 'prompt-customization', 'plugins-selection'];
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
        const { shell, editor, prompt, plugins } = this.config;
        const colors = this.colorSchemes[prompt.colorScheme];

        let config = '#!/bin/bash\n';
        config += '# Generated by terminal-tweaker\n';
        config += `# Date: ${new Date().toLocaleDateString()}\n\n`;

        // Build prompt
        config += '# Custom Prompt Configuration\n';

        if (shell === 'bash') {
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
                config += '\n# Git branch in prompt\n';
                config += 'parse_git_branch() {\n';
                config += '    git branch 2> /dev/null | sed -e \'/^[^*]/d\' -e \'s/* \\(.*\\)/ (\\1)/\'\n';
                config += '}\n\n';

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
                config += 'zstyle \':vcs_info:git:*\' formats \'(%b)\'\n';
                prompt_str += ' %F{red}${vcs_info_msg_0_}%f';
            }
            prompt_str += ' $ "\n';
            config += prompt_str;
        }

        // Editor configuration
        config += `\n# Editor Configuration\n`;
        config += `export EDITOR="${editor}"\n`;
        config += `export VISUAL="${editor}"\n\n`;

        // Common aliases
        config += '# Common Aliases\n';
        config += 'alias ll="ls -lah"\n';
        config += 'alias la="ls -A"\n';
        config += 'alias l="ls -CF"\n';
        config += `alias vi="${editor}"\n`;
        config += 'alias grep="grep --color=auto"\n\n';

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

        // Additional useful settings
        config += '# History Configuration\n';
        config += 'export HISTSIZE=10000\n';
        config += 'export HISTFILESIZE=20000\n';
        if (shell === 'bash') {
            config += 'export HISTCONTROL=ignoredups:erasedups\n';
        }
        config += '\n';

        config += '# Enable color support\n';
        config += 'export CLICOLOR=1\n';
        config += 'export LSCOLORS=ExGxBxDxCxEgEdxbxgxcxd\n\n';

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
            plugins: []
        };
        this.showScreen('onboarding');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
