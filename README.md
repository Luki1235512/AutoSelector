# SelectorSnap

A Chrome DevTools extension that helps you generate and test CSS selectors and XPath expressions for web elements.

## Features

- **Automatic Selector Generation**: Generates multiple selector types (XPath, CSS Path, ID, Class, Name, Tag) for selected elements
- **Element Highlighting**: Visual feedback showing matched elements on the page
- **Easy Copy**: One-click copy functionality for all selectors

## Installation

### Install from Source (Developer Mode)

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
   - The SelectorSnap icon should appear in your extensions toolbar
   - Open Chrome DevTools (F12 or right-click → Inspect)
   - Look for the "SelectorSnap" sidebar pane in the Elements panel

## License

ISC
