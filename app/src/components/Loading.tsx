import { Spin } from 'antd';
import React from 'react';
import { Box, Flex } from 'rebass';

export interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => (
  <Flex justifyContent="center">
    <Box>
      <Spin size="large" />
    </Box>
  </Flex>
);

export default Loading;
