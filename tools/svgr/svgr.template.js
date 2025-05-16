// svgr.template.js
// A custom SVGR template to generate React components for iconiq
const { pascalCase } = require('change-case');

/**
 * Custom SVGR template that integrates with the iconiq architecture
 * - Supports the variant system (outline, filled, sharp)
 * - Includes accessibility labels
 * - Compatible with tree-shaking
 * - Maintains consistent styling across icons
 * - Uses PascalCase for component names and imports
 */
module.exports = (
  { template },
  opts,
  { componentName, jsx, imports, exports, interfaces, props }
) => {
  // Get the variant from options or default to 'outline'
  const variant = opts.variant || 'outline';

  // Format to PascalCase without Icon suffix
  const baseName = componentName.name.replace(/Icon$/, '');

  // Get accessibility label from options or create one from component name
  const a11yLabel = opts.a11yLabel || baseName.replace(/([A-Z])/g, ' $1').trim() + ' icon';

  // Create the template with TypeScript and JSX support
  const tpl = template.smart({ plugins: ['typescript', 'jsx'] });

  // Extract the path data to be used with the iconiq system
  const extractPathData = jsxContent => {
    // Collect all path data for later use with iconiq's path handling
    const paths = [];
    const extractPathsFromJSX = node => {
      if (node.openingElement && node.openingElement.name.name === 'path') {
        const dAttr = node.openingElement.attributes.find(
          attr => attr.name && attr.name.name === 'd'
        );
        if (dAttr && dAttr.value) {
          paths.push(dAttr.value.value);
        }
      }

      if (node.children) {
        node.children.forEach(child => {
          if (child.type === 'JSXElement') {
            extractPathsFromJSX(child);
          }
        });
      }
    };

    if (Array.isArray(jsxContent)) {
      jsxContent.forEach(extractPathsFromJSX);
    } else if (jsxContent.type === 'JSXElement') {
      extractPathsFromJSX(jsxContent);
    }

    return paths;
  };

  // Extract path data from JSX
  const pathData = extractPathData(jsx);

  // Generate a variant-aware component name (always PascalCase)
  const variantSuffix = variant !== 'outline' ? pascalCase(variant) : '';
  const iconComponentName = baseName + variantSuffix + 'Icon';

  // internal name will be in kebab-case
  const internalName = baseName.replace(/([A-Z])/g, (match, p1, offset) =>
    offset === 0 ? p1.toLowerCase() : '-' + p1.toLowerCase()
  );

  // Extract viewBox if available from props
  let viewBox = opts.viewBox || '0 0 24 24';

  // Return the AST template
  return tpl.ast`
    import React, { forwardRef } from 'react';
    import { createIconiqIcon } from '../createIconiqIcon';
    import { IconData } from '@iconiq/shared';

    // Icon data with path and variant information
    const iconData: IconData = {
      name: "${internalName}",
      displayName: "${baseName}",
      a11yLabel: "${a11yLabel}",
      tags: ${JSON.stringify(opts.tags || [])},
      categories: ${JSON.stringify(opts.categories || [])},
      variants: {
        "${variant}": {
          path: "${pathData.join(' ')}",
          viewBox: "${viewBox}"
        }
      }
    };

    /**
     * ${iconComponentName} component
     *
     * @example
     * import { ${baseName}${variantSuffix !== '' ? variantSuffix : ''} } from '@iconiq/react';
     *
     * function MyComponent() {
     *   return <${baseName}${variantSuffix !== '' ? variantSuffix : ''} size={24} color="blue" />;
     * }
     */
    export const ${baseName}${variantSuffix !== '' ? variantSuffix : ''} = createIconiqIcon(
      iconData.name,
      iconData,
      "${variant}"
    );

    // For backwards compatibility with default exports
    export default ${baseName}${variantSuffix !== '' ? variantSuffix : ''};
  `;
};
