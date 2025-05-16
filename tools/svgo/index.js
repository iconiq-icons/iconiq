const { optimize } = require('svgo');
const config = require('./config');

/**
 * Optimize SVG content using SVGO
 *
 * @param {string} svgContent - SVG content to optimize
 * @returns {string} Optimized SVG content
 */
function optimizeSvg(svgContent) {
  const result = optimize(svgContent, config);
  return result.data;
}

/**
 * Optimize SVG path
 *
 * @param {string} path - SVG path to optimize
 * @returns {string} Optimized SVG path
 */
function optimizePath(path) {
  // Wrap the path in a temporary SVG and optimize it
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}" /></svg>`;
  const optimized = optimizeSvg(svgContent);

  // Extract the path from the optimized SVG
  const match = optimized.match(/<path d="([^"]+)"/);
  if (!match) {
    throw new Error('Failed to extract path from optimized SVG');
  }

  return match[1];
}

module.exports = {
  optimizeSvg,
  optimizePath,
};
