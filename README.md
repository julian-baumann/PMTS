<div align="center">
<p align="center">
<img align="center" src="https://gitlab.com/julianbaumann/pmts-server/raw/master/Assets/Logo.png" width="150"/>
</p>
</div>

<div align="center">
<h1 style="text-align: center">PMTS - Play Me That Shit</h1>
</div>

This program runs quietly in the background and hosts a server and a website from which files and links can be uploaded. The server then opens the media (videos, photos, gifs, youtube links...) in a fullscreen window.

# Supported Platforms
- Linux (AppImage)
- macOS (dmg)
- Windows (exe - nsis installer) (Not fully tested)


# Demo

<div align="center">
<p align="center">
<img align="center" src="https://gitlab.com/julianbaumann/pmts-server/raw/master/Assets/Preview.gif" width="700"/>
</p>
</div>


# Run for development
## Requirements
- node
- npm (npx)
- electron

```bash
cd Implementation
npm install
npm run start
```

<br />
<br />
<br />

# Build for all platforms
## Requirements
- node
- npm (npx)

```bash
./Build.sh
```