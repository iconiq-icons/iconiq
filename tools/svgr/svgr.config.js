// SVGR configuration
const path = require('path');
const template = require('./svgr.template');
const svgoConfig = require('../svgo/config');

/**
 * SVGR configuration for iconiq
 *
 * This configuration:
 * - Uses our custom template to generate React components
 * - Integrates with SVGO for optimization
 * - Sets reasonable defaults for icon generation
 * - Handles variants and accessibility
 */
module.exports = {
  // Use our custom template
  template,

  // Path to the SVG icons
  icon: true,

  // Keep accessibility attributes
  svgProps: {
    role: 'img',
  },

  // Set default dimensions
  dimensions: true,

  // Enable TypeScript
  typescript: true,

  // Use our SVGO configuration for optimization
  svgoConfig,

  // Index file generation settings
  indexTemplate: filePaths => {
    const exportEntries = filePaths.map(filePath => {
      const basename = path.basename(filePath, path.extname(filePath));
      return `export { default as ${basename}, ${basename} } from './${basename}'`;
    });
    return exportEntries.join('\n');
  },

  // Default SVGR options (can be overridden per command)
  svgrConfig: {
    ref: true,
    memo: true,
    titleProp: true,
    expandProps: 'end',
    replaceAttrValues: {
      '#000': 'currentColor',
      '#000000': 'currentColor',
      black: 'currentColor',
    },
  },

  // Default variant (can be overridden when running SVGR)
  variant: 'outline',

  // JSX runtime
  jsxRuntime: 'automatic',

  // SVG to use when nothing is set
  placeholder: `<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>`,
};
