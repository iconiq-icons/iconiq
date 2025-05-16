/**
 * Represents an SVG path element attribute tuple - [tagName, attributes]
 */
export type IconNodeElement = [string, Record<string, string>];

/**
 * Represents a complete icon structure of element tuples
 */
export type IconNode = IconNodeElement[];

/**
 * Icon variant types
 */
export type IconVariant = 'outline' | 'filled' | 'sharp';

/**
 * Base icon data structure used for JSON definition
 */
export interface IconData {
  name: string;
  tags: string[];
  a11yLabel: string;
  categories: string[];
  variants: {
    [key in IconVariant]?: {
      path: string;
    };
  };
}

/**
 * Base props shared by all icon components
 */
export interface BaseIconProps extends React.SVGAttributes<SVGElement> {
  /**
   * Icon color (defaults to currentColor)
   */
  color?: string;

  /**
   * Icon size in pixels (defaults to 24)
   */
  size?: number | string;

  /**
   * Stroke width (defaults to 2)
   */
  strokeWidth?: number | string;

  /**
   * Whether to use absolute stroke width
   */
  absoluteStrokeWidth?: boolean;

  /**
   * Accessibility label for the icon
   */
  a11yLabel?: string;

  /**
   * Icon variant (outline, filled, sharp)
   */
  variant?: IconVariant;
}

/**
 * Default SVG attributes for all icons
 */
export const defaultAttributes = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
