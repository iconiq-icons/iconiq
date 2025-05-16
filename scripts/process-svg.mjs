const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const svgo = require('../tools/svgo');
const { extractPathsFromSVG } = require('../packages/shared/dist/utils');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Process an SVG file and convert it to our JSON format
 *
 * @param {string} filePath - Path to the SVG file
 * @param {string} iconName - Name of the icon
 * @param {string} variant - Variant of the icon (outline, filled, sharp)
 */
async function processSvg(filePath, iconName, variant = 'outline') {
  try {
    // Read the SVG file
    const svgContent = await readFile(filePath, 'utf8');

    // Optimize the SVG
    const optimizedSvg = svgo.optimizeSvg(svgContent);

    // Extract the path
    const paths = extractPathsFromSVG(optimizedSvg);
    if (paths.length === 0) {
      throw new Error(`No paths found in SVG: ${filePath}`);
    }

    // Join multiple paths if needed
    const path = paths.join(' ');

    // Check if a JSON file already exists for this icon
    const jsonPath = path.resolve(__dirname, `../icons/${iconName}.json`);
    let iconData;

    if (await exists(jsonPath)) {
      // Read existing icon data
      const existingData = await readFile(jsonPath, 'utf8');
      iconData = JSON.parse(existingData);

      // Update the variant
      iconData.variants[variant] = { path };
    } else {
      // Create new icon data
      iconData = {
        name: iconName,
        tags: [], // Would be populated with real tags
        a11yLabel: `${iconName.split('-').join(' ')} icon`,
        categories: [], // Would be populated with real categories
        variants: {
          [variant]: { path },
        },
      };
    }

    // Write the JSON file
    await writeFile(jsonPath, JSON.stringify(iconData, null, 2), 'utf8');

    console.log(`Processed ${iconName} (${variant})`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

/**
 * Process a directory of SVG files
 *
 * @param {string} directory - Directory containing SVG files
 * @param {string} variant - Variant to assign to these SVGs
 */
async function processDirectory(directory, variant = 'outline') {
  try {
    // Ensure the input directory exists
    if (!(await exists(directory))) {
      throw new Error(`Directory not found: ${directory}`);
    }

    // Ensure the output directory exists
    const outputDir = path.resolve(__dirname, '../icons');
    if (!(await exists(outputDir))) {
      await promisify(fs.mkdir)(outputDir, { recursive: true });
    }

    // Get all SVG files
    const files = (await readdir(directory)).filter(file => file.endsWith('.svg'));

    // Process each file
    for (const file of files) {
      const iconName = path.basename(file, '.svg').toLowerCase().replace(/\s+/g, '-');
      const filePath = path.join(directory, file);

      await processSvg(filePath, iconName, variant);
    }

    console.log(`Processed ${files.length} SVG files from ${directory}`);
  } catch (error) {
    console.error('Error processing directory:', error);
  }
}

// The script can be used from the command line
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: node process-svg.js <directory> [variant]');
    process.exit(1);
  }

  const directory = args[0];
  const variant = args[1] || 'outline';

  processDirectory(directory, variant)
    .then(() => console.log('Done!'))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = {
  processSvg,
  processDirectory,
};
