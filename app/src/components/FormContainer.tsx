import React from 'react';
import { Box, BoxProps } from 'rebass';

const FormContainer: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props} mx={4}>
    {children}
  </Box>
);

export default FormContainer;
