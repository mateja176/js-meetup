import { Avatar } from 'antd';
import React from 'react';

const size = 10;

export const StatusCircle: React.FC<{
  color: React.CSSProperties['color'];
}> = ({ color, children }) => (
  <>
    <Avatar
      style={{
        background: color,
        height: size,
        width: size,
        marginRight: 5,
      }}
    />
    {children}
  </>
);

export default StatusCircle;
