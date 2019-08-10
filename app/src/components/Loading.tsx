import { Spin } from 'antd';
import React from 'react';
import { Box, Flex, FlexProps } from 'rebass';

export interface LoadingProps extends FlexProps {}

const Loading: React.FC<LoadingProps> = props => (
  <Flex justifyContent="center" {...props}>
    <Box>
      <Spin size="large" />
    </Box>
  </Flex>
);

export default Loading;
