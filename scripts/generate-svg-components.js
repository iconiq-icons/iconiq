#!/usr/bin/env node
/**
 * Script to generate React components from SVG files using SVGR
 *
 * This script:
 * - Takes a directory of SVG files as input
 * - Processes them using SVGR with our custom configuration
 * - Outputs React components with variant support
 * - Creates JSON icon data in our format
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { transform } = require('@svgr/core');
const svgrConfig = require('../tools/svgr/svgr.config');
const svgoConfig = require('../tools/svgo/config');
const svgo = require('../tools/svgo');
const { pascalCase } = require('change-case');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

/**
 * Process an SVG file and convert it to a React component and JSON data
 *
 * @param {string} filePath - Path to the SVG file
 * @param {string} outputDir - Directory to write the component to
 * @param {string} jsonOutputDir - Directory to write the JSON data to
 * @param {Object} options - Processing options
 */
async function processSvgFile(filePath, outputDir, jsonOutputDir, options = {}) {
  try {
    // Extract the base name for the component
    const variant = options.variant || 'outline';
    const fileName = path.basename(filePath, '.svg');
    // Ensure componentName is PascalCase
    const componentName = pascalCase(fileName);
    // Use kebab-case for internal icon name
    const iconName = componentName.replace(/([A-Z])/g, (match, p1, offset) =>
      offset === 0 ? p1.toLowerCase() : '-' + p1.toLowerCase()
    );

    // Generate a variant-aware component name
    const variantSuffix = variant !== 'outline' ? pascalCase(variant) : '';
    const fullComponentName = `${componentName}${variantSuffix}Icon`;

    console.log(`Processing ${fileName} as ${fullComponentName}...`);

    // Read the SVG file
    const svgCode = await readFile(filePath, 'utf8');

    // Optimize SVG with SVGO
    const optimizedSvg = svgo.optimizeSvg(svgCode);

    // Extract accessibility label from file name
    const a11yLabel =
      options.a11yLabel || componentName.replace(/([A-Z])/g, ' $1').trim() + ' icon';

    // Transform the SVG to a React component
    const jsCode = await transform(
      optimizedSvg,
      {
        ...svgrConfig,
        // Override config with specific options
        typescript: true,
        componentName: fullComponentName,
        template: svgrConfig.template,
        tags: options.tags || [],
        a11yLabel,
        categories: options.categories || [],
        variant,
      },
      { componentName: fullComponentName }
    );

    // Ensure the output directory exists
    if (!(await exists(outputDir))) {
      await mkdir(outputDir, { recursive: true });
    }

    // Write the component file
    const outputFile = path.join(outputDir, `${fullComponentName}.tsx`);
    await writeFile(outputFile, jsCode);

    // Extract path data for JSON
    const pathMatch = /<path[^>]*d="([^"]+)"[^>]*>/g;
    const paths = [];
    let match;
    while ((match = pathMatch.exec(optimizedSvg)) !== null) {
      paths.push(match[1]);
    }
    const pathData = paths.join(' ');

    // Generate JSON data for the icon
    if (jsonOutputDir) {
      // Ensure the JSON output directory exists
      if (!(await exists(jsonOutputDir))) {
        await mkdir(jsonOutputDir, { recursive: true });
      }

      // Check if a JSON file already exists - use PascalCase for JSON filenames
      const jsonPath = path.join(jsonOutputDir, `${componentName}.json`);

      // Extract viewBox from optimized SVG
      const viewBoxMatch = optimizedSvg.match(/viewBox="([^"]+)"/);
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

      let iconData = {
        name: iconName,
        displayName: componentName,
        a11yLabel,
        tags: options.tags || [],
        categories: options.categories || [],
        version: options.version || '0.1.0',
        variants: {},
      };

      // If the JSON file exists, read it and update it
      if (await exists(jsonPath)) {
        const existingData = JSON.parse(await readFile(jsonPath, 'utf8'));
        iconData = {
          ...existingData,
          variants: {
            ...existingData.variants,
          },
        };
      }

      // Add or update the variant
      iconData.variants[variant] = {
        path: pathData,
        viewBox,
      };

      // Write the JSON file using PascalCase naming
      await writeFile(jsonPath, JSON.stringify(iconData, null, 2));
    }

    return {
      componentName: fullComponentName,
      iconName: componentName, // Use PascalCase for component imports
      variant,
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

/**
 * Process a directory of SVG files
 *
 * @param {string} inputDir - Directory containing SVG files
 * @param {string} outputDir - Directory to write components to
 * @param {string} jsonOutputDir - Directory to write JSON data to
 * @param {Object} options - Processing options
 */
async function processDirectory(inputDir, outputDir, jsonOutputDir, options = {}) {
  try {
    // Validate input directory
    if (!(await exists(inputDir))) {
      throw new Error(`Input directory does not exist: ${inputDir}`);
    }

    // Get all SVG files
    const files = (await readdir(inputDir)).filter(file => file.toLowerCase().endsWith('.svg'));

    if (files.length === 0) {
      console.warn(`No SVG files found in ${inputDir}`);
      return [];
    }

    console.log(`Found ${files.length} SVG files in ${inputDir}`);

    // Process each file
    const results = [];
    for (const file of files) {
      const result = await processSvgFile(
        path.join(inputDir, file),
        outputDir,
        jsonOutputDir,
        options
      );

      if (result) {
        results.push(result);
      }
    }

    // Generate an index file for the components
    if (results.length > 0) {
      const indexContent =
        results.map(({ componentName }) => `export * from './${componentName}';`).join('\n') + '\n';

      await writeFile(path.join(outputDir, 'index.ts'), indexContent);
    }

    console.log(`Successfully processed ${results.length} SVG files`);
    return results;
  } catch (error) {
    console.error('Error processing directory:', error);
    return [];
  }
}

/**
 * Main function to run the script
 */
async function main() {
  try {
    const args = process.argv.slice(2);

    // Parse arguments
    const inputDir = args[0];
    const variant = args[1] || 'outline';

    if (!inputDir) {
      console.error('Usage: node generate-svg-components.js <input-dir> [variant]');
      console.error('Example: node generate-svg-components.js ./svg/outline outline');
      process.exit(1);
    }

    // Set up output directories
    const reactOutputDir = path.resolve(__dirname, '../packages/iconiq-react/src/icons');
    const jsonOutputDir = path.resolve(__dirname, '../icons');

    // Process the directory
    await processDirectory(inputDir, reactOutputDir, jsonOutputDir, { variant });

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main();
