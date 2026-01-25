# AutoSelector

A Chrome DevTools extension that helps you generate and test CSS selectors and XPath expressions for web elements.

<img width="1920" height="925" alt="SCREEN01" src="https://github.com/user-attachments/assets/4858cc60-6694-45bf-8f00-afb0a8f01e35" />

## Features

- **Automatic Selector Generation**: Generates multiple selector types (XPath, CSS Path, ID, Class, Name, Tag) for selected elements
- **Element Highlighting**: Visual feedback showing matched elements on the page
- **Easy Copy**: One-click copy functionality for all selectors

## Installation

### Install from Source

1. **Clone or download this repository**:

   ```bash
   git clone https://github.com/Luki1235512/AutoSelector.git
   cd AutoSelector
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the extension**:

   ```bash
   npm run build
   ```

   This will create a `dist` folder with the compiled extension.

4. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner)
   - Click **Load unpacked**
   - Select the `dist` folder from your project directory

5. **Verify installation**:
   - The AutoSelector icon should appear in your extensions toolbar
   - Open Chrome DevTools (F12 or right-click → Inspect)
   - Look for the "AutoSelector" sidebar pane in the Elements panel

### Install from Release

1. **Download the latest release**:
   - Go to the [Releases page](https://github.com/Luki1235512/AutoSelector/releases)
   - Download `AutoSelector-v*.zip`
   - Extract the ZIP file to a folder on your computer

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner)
   - Click **Load unpacked**
   - Select the extracted folder

3. **Verify installation**:
   - The AutoSelector icon should appear in your extensions toolbar
   - Open Chrome DevTools (F12 or right-click → Inspect)
   - Look for the "AutoSelector" sidebar pane in the Elements panel

## License

ISC
