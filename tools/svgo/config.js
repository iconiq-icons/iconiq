/**
 * SVGO configuration for optimizing SVG files
 */
module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Don't remove the viewBox
          removeViewBox: false,

          // Don't collapse groups
          collapseGroups: false,
        },
      },
    },
    // Remove all fill attributes
    {
      name: 'removeAttrs',
      params: {
        attrs: ['fill', 'class'],
      },
    },
    // Make IDs unique
    'cleanupIDs',
    // Sort attributes
    'sortAttrs',
    // Remove comments
    'removeComments',
    // Remove metadata
    'removeMetadata',
    // Remove descriptions
    'removeDesc',
    // Remove title elements
    'removeTitle',
    // Remove editor namespace
    'removeEditorsNSData',
    // Remove empty attributes
    'removeEmptyAttrs',
  ],
};
