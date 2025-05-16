import React, { forwardRef, createElement } from 'react';
import { BaseIconProps, IconNode, defaultAttributes, mergeClasses } from '@iconiq/shared';

export interface IconComponentProps extends BaseIconProps {
  iconNode: IconNode;
  children?: React.ReactNode;
}

/**
 * Base Icon component that handles rendering SVG with the proper attributes
 */
export const Icon = forwardRef<SVGSVGElement, IconComponentProps>(
  (
    {
      color = 'currentColor',
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = '',
      a11yLabel,
      children,
      iconNode,
      ...rest
    },
    ref,
  ) =>
    createElement(
      'svg',
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
        className: mergeClasses('iconiq', className),
        'aria-label': a11yLabel,
        role: a11yLabel ? 'img' : 'presentation',
        ...rest,
      },
      [
        ...iconNode.map(([tag, attrs], index) => createElement(tag, { key: index, ...attrs })),
        ...(Array.isArray(children) ? children : [children]),
      ],
    ),
);
