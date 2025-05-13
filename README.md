# TVM Calculator Chrome Extension

A Time Value of Money calculator Chrome extension that helps with financial calculations.

## Features

- Calculate any of the five TVM variables when given the other four:
  - Present Value (PV)
  - Future Value (FV)
  - Payment (PMT)
  - Interest Rate
  - Number of Periods
- Support for beginning or end of period payments
- Clean, simple interface

## Setup Instructions

### Generating Icons

The extension requires icons in three sizes: 16x16, 48x48, and 128x128 pixels.

1. Navigate to the `/icons` directory
2. Use the provided `icon.svg` file as a source
3. Generate PNG files using one of these methods:
   - Use the `generate_pngs.js` script if you have Node.js and Inkscape installed
   - Use an online SVG to PNG converter like [svgtopng.com](https://svgtopng.com/) 
   - Open the SVG in a browser and take screenshots at the required sizes

### Installing the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The TVM Calculator icon should appear in your browser toolbar

## Usage

1. Click the extension icon to open the calculator
2. Enter values for all fields except the one you want to solve for
3. Select what you want to calculate from the "Solve for" dropdown
4. Click "Calculate" to see the result