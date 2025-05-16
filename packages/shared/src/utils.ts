import { IconData, IconNode, IconVariant } from './types';

/**
 * Convert a string from kebab-case to PascalCase
 *
 * @param str - The kebab-case string to convert
 * @returns The string converted to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/**
 * Merge CSS class names while filtering out falsy values
 *
 * @param classes - Array of class names or undefined values
 * @returns A single space-separated string of class names
 */
export function mergeClasses(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Converts an SVG path string to an icon node structure
 *
 * @param path - The SVG path string
 * @returns An IconNode array with a single path element
 */
export function convertPathToIconNode(path: string): IconNode {
  return [['path', { d: path }]];
}

/**
 * Get the icon node for a specific variant, falling back to outline if needed
 *
 * @param iconData - The icon data object
 * @param variant - The desired icon variant (defaults to 'outline')
 * @returns The icon node structure for the requested variant
 * @throws Error if no valid variant is found
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
 *
 * @param svgString - The SVG content as a string
 * @returns Array of path data strings extracted from the SVG
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

/**
 * Sanitize props by removing size-related properties
 *
 * @param props - The props object to sanitize
 * @returns A new props object with size-related properties removed
 */
export function sanitizeProps<T extends Record<string, unknown>>(
  props: T
): Omit<T, 'size' | 'width' | 'height'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { size, width, height, ...rest } = props;
  return rest;
}
