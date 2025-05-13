const fs = require('fs');
const { exec } = require('child_process');

// Check if Inkscape is installed
console.log('This script requires Inkscape to be installed to convert SVG to PNG');
console.log('If you don\'t have Inkscape, you can use online tools like:');
console.log('- https://svgtopng.com/');
console.log('- https://ezgif.com/svg-to-png');
console.log('- https://convertio.co/svg-png/');

// Generate PNGs using Inkscape if available
const sizes = [16, 48, 128];

sizes.forEach(size => {
  const command = `inkscape --export-filename=icon${size}.png --export-width=${size} --export-height=${size} icon.svg`;
  
  console.log(`Generating ${size}x${size} icon...`);
  
  exec(command, (error) => {
    if (error) {
      console.error(`Error generating ${size}x${size} icon: ${error.message}`);
      console.log(`\nAlternative: Use a web browser to view the SVG file and take a screenshot of size ${size}x${size}`);
    } else {
      console.log(`Successfully created icon${size}.png`);
    }
  });
});
