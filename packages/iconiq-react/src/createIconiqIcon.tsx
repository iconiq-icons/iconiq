import React, { forwardRef, createElement } from 'react';
import {
  BaseIconProps,
  IconData,
  IconNode,
  IconVariant,
  mergeClasses,
  convertPathToIconNode,
  toPascalCase,
} from '@iconiq/shared';
import { Icon } from './Icon';

export interface IconiqProps extends BaseIconProps {
  /**
   * The variant of the icon to display
   */
  variant?: IconVariant;
}

/**
 * Create an icon component from the icon data
 */
export function createIconiqIcon(
  iconName: string,
  iconData: IconData,
  defaultVariant: IconVariant = 'outline'
) {
  const Component = forwardRef<SVGSVGElement, IconiqProps>(
    ({ className, variant = defaultVariant, a11yLabel = iconData.a11yLabel, ...props }, ref) => {
      // Get the path for the selected variant, falling back to outline if not available
      const variantData =
        iconData.variants[variant] ||
        iconData.variants[defaultVariant] ||
        iconData.variants.outline;

      if (!variantData) {
        throw new Error(`No valid variant found for icon ${iconName}`);
      }

      const iconNode: IconNode = convertPathToIconNode(variantData.path);

      return createElement(Icon, {
        ref,
        iconNode,
        className: mergeClasses(`iconiq-${iconName}`, className),
        a11yLabel,
        ...props,
      });
    }
  );

  Component.displayName = `${toPascalCase(iconName)}${defaultVariant !== 'outline' ? toPascalCase(defaultVariant) : ''}Icon`;
  return Component;
}
