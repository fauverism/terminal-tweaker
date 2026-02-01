# 🧑‍💻 terminal-tweaker

A minimalist web-based configuration builder for customizing your terminal environment. 

## https://terminal-tweaker.vercel.app/

## Features

- **Interactive Onboarding**: Choose to start fresh or import existing configurations
- **Shell Selection**: Support for Bash and Zsh
- **Editor Configuration**: Choose from vim, neovim, emacs, nano, or vscode
- **Custom Prompts**: Build beautiful terminal prompts with:
  - User@hostname display
  - Current directory path
  - Git branch integration
  - Timestamp support
  - Multiple color schemes (default, dracula, monokai, gruvbox)
- **Plugin Recommendations**: Curated plugin suggestions for each editor
- **Live Preview**: See your prompt in real-time as you customize
- **Export Ready Configs**: Download complete configuration files

## Quick Start from GH

1. Open `index.html` in your browser
2. Choose your starting point (fresh or import existing)
3. Select your shell and editor
4. Customize your prompt with live preview
5. Choose recommended plugins
6. Download your configuration

## Usage

### Local Development

Simply open the `index.html` file in any modern web browser:

```bash
open index.html
```

Or serve it with a local server:

```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Installing Generated Config

1. Download the configuration file from the export screen
2. Move it to your home directory:
   ```bash
   mv ~/Downloads/.bash_profile ~/.bash_profile
   ```
3. Reload your shell:
   ```bash
   source ~/.bash_profile
   ```

## Supported Editors

- **vim**: Classic modal editor with plugins like NERDTree, vim-airline, fzf
- **neovim**: Modern vim with Lua-based plugins (nvim-tree, telescope, LSP)
- **emacs**: Extensible editor with Evil, Magit, Helm
- **nano**: Simple editor with syntax highlighting and line numbers
- **vscode**: Terminal integration with popular extensions

## Color Schemes

- **default**: Blue, green, and red tones
- **dracula**: Vibrant purple and cyan
- **monokai**: Classic monokai palette
- **gruvbox**: Warm retro groove

## Design Philosophy

- Dark theme optimized for long coding sessions
- Monospace fonts (JetBrains Mono)
- Subtle animations and transitions
- No build step required - pure HTML/CSS/JS
- Keyboard and mouse friendly

## Browser Compatibility

Works on all modern browsers that support:
- CSS Grid
- CSS Custom Properties
- ES6+ JavaScript

## Project Structure

```
terminal-tweaker/
├── index.html          # Main application
├── styles.css          # Dark theme styling
├── app.js             # Application logic
└── README.md          # Documentation
```

## Customization

The app stores configuration in the `app.config` object. You can extend:

- **Color schemes**: Add to `app.colorSchemes`
- **Plugins**: Extend `app.plugins` object
- **Shell types**: Modify shell selection options
- **Editors**: Add new editors to the selection

## Contributing

This is a personal project, but feel free to fork and customize for your needs!

## License

MIT

## Credits

Design inspiration from:
- [skills.sh](https://skills.sh/)
- [musicforprogramming.net](https://musicforprogramming.net)

Built with care for terminal enthusiasts.
