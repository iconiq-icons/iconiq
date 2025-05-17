'use client';

import React, { useState } from 'react';
import IconComponent, { IconProps } from './IconComponent';

export const ClientIconComponent: React.FC<IconProps> = (props) => {
  const [clicked, setClicked] = useState(false);

  // This component will run only on the client
  return (
    <div
      onClick={() => setClicked(!clicked)}
      data-testid="client-icon-wrapper"
      className={clicked ? 'clicked' : ''}
    >
      <IconComponent {...props} />
      {clicked && <span>Clicked!</span>}
    </div>
  );
};

export default ClientIconComponent;
