# UluP Spaces — Quick Capture

A Chrome extension (Manifest V3) that saves any web page as a node in one of your [UluP Spaces](https://ulupspaces.com) projects, in one click — powered by UluP Spaces' [public REST API](https://ulupstudio.com/developers).

## What it does

- Reads the title of the page you're on and suggests it as the node name.
- You pick which project to save it into, and a color.
- Optionally, it also adds the page's link as a task inside the newly created node.
- Everything goes through the public REST API (`https://www.ulupspaces.com/api/v1`) with your own personal key — no middle server, nothing routed anywhere else.

## Installation (from source)

The extension isn't on the Chrome Web Store yet, so it needs to be loaded "unpacked":

1. Download or clone this repo.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the repo folder.

## Setup

1. Go to [UluP Spaces → Profile → REST API & SDK](https://ulupspaces.com/?view=profile) and generate an API key.
2. Right-click the extension icon → **Options**.
3. Paste the key and save. It's stored locally only, in your browser (`chrome.storage.local`) — it's never sent anywhere other than the UluP Spaces REST API.

## Usage

Open the popup from the extension icon on any page, pick a project, check/edit the node name, choose a color, and save. Done.

## Stack

Vanilla JS, HTML and CSS — no dependencies, no bundler. Manifest V3.

## Contributing

Pull requests welcome. The code is intentionally simple (no framework) to stay easy to read and modify.

## License

MIT — see [LICENSE](./LICENSE).
