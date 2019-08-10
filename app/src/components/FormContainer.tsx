import React from 'react';
import { Box, BoxProps } from 'rebass';

const FormContainer: React.FC<Omit<BoxProps, 'mx'>> = ({
  children,
  style,
  ...props
}) => (
  <Box {...props} style={{ ...style, position: 'relative' }} mx={4}>
    {children}
  </Box>
);

export default FormContainer;
