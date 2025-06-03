import React from 'react';

const Text = ({
  children,
  color = '#030303',
  fontSize = '16px',
  fontWeight,
  lineHeight = '24px',
  fontFamily = 'IBM Plex Sans',
  ...rest
}) => (
  <div style={{
    color,
    fontSize,
    fontWeight,
    lineHeight,
    fontFamily,
    ...rest.style,
  }}>
    {children}
  </div>
);

export default Text;
