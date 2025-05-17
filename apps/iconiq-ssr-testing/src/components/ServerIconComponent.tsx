import React from 'react';
import IconComponent, { IconProps } from './IconComponent';

export async function ServerIconComponent(props: IconProps) {
  // This is a Server Component
  return <IconComponent {...props} />;
}

export default ServerIconComponent;
