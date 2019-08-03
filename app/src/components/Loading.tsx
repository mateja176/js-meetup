import { Spin } from 'antd';
import React from 'react';

export interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => <Spin size="large" />;

export default Loading;
