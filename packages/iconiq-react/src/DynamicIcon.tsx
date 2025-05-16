import { getIconData } from '@iconiq/core';
import { IconNode } from '@iconiq/shared';
import React, { forwardRef, useState, useEffect, ComponentType } from 'react';

import { IconiqProps } from './createIconiqIcon';
import { Icon } from './Icon';

export interface DynamicIconComponentProps extends IconiqProps {
  /**
   * Name of the icon to load
   */
  name: string;

  /**
   * Fallback component to render while loading
   */
  fallback?: ComponentType;
}

/**
 * Dynamic icon component that loads icons on demand
 *
 * @param props - The component props including the icon name to load
 * @param ref - Forwarded ref to the SVG element
 * @returns A React component that asynchronously loads and renders the requested icon
 */
export const DynamicIcon = forwardRef<SVGSVGElement, DynamicIconComponentProps>(
  ({ name, variant = 'outline', fallback, ...props }, ref) => {
    const [iconNode, setIconNode] = useState<IconNode>();
    const [a11yLabel, setA11yLabel] = useState<string>();

    useEffect(() => {
      let isMounted = true;

      const loadIcon = async () => {
        try {
          const iconData = await getIconData(name);

          if (!isMounted) return;

          // Get the path for the selected variant, falling back to outline
          const variantData = iconData.variants[variant] || iconData.variants.outline;

          if (!variantData) {
            throw new Error(`No valid variant found for icon ${name}`);
          }

          setA11yLabel(iconData.a11yLabel);
          setIconNode([['path', { d: variantData.path }]]);
        } catch (error) {
          console.error(`Failed to load icon: ${name}`, error);
        }
      };

      loadIcon();

      return () => {
        isMounted = false;
      };
    }, [name, variant]);

    if (!iconNode) {
      return fallback ? React.createElement(fallback) : null;
    }

    return <Icon ref={ref} iconNode={iconNode} a11yLabel={a11yLabel} {...props} />;
  }
);
