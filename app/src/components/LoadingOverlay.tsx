import React from 'react';
import Loading, { LoadingProps } from './Loading';

export interface LoadingOverlayProps extends LoadingProps {}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ style, ...props }) => (
  <Loading
    {...props}
    style={{
      ...style,
      position: 'absolute',
      top: '50%',
      left: '50%',
      zIndex: 2,
    }}
  />
);

export default LoadingOverlay;
