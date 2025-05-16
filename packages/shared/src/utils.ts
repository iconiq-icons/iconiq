import { IconData, IconNode, IconVariant } from './types';

/**
 * Convert a string from kebab-case to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/**
 * Merge CSS class names
 */
export function mergeClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Converts an SVG path string to an icon node structure
 */
export function convertPathToIconNode(path: string): IconNode {
  return [['path', { d: path }]];
}

/**
 * Get the icon node for a specific variant
 */
export function getVariantNode(iconData: IconData, variant: IconVariant = 'outline'): IconNode {
  // Fallback to outline if the requested variant doesn't exist
  const variantData = iconData.variants[variant] || iconData.variants.outline;

  if (!variantData) {
    throw new Error(`No valid variant found for icon ${iconData.name}`);
  }

  return convertPathToIconNode(variantData.path);
}

/**
 * Parse SVG string to extract path data
 */
export function extractPathsFromSVG(svgString: string): string[] {
  const paths: string[] = [];
  const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;

  let match;
  while ((match = pathRegex.exec(svgString)) !== null) {
    paths.push(match[1]);
  }

  return paths;
}
