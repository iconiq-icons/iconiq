import React from 'react';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const IconComponent: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
}) => {
  return (
    <div
      className={`icon-component ${className}`}
      data-testid="icon-component"
      style={{
        width: size,
        height: size,
        color,
      }}
    >
      {name}
    </div>
  );
};

export default IconComponent;
