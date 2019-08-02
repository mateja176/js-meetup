import React from 'react';
import { Njam as NjamModel } from '../../api/src/models';

const Njam: React.FC<NjamModel> = props => (
  <pre>{JSON.stringify(props, null, 2)}</pre>
);

export default Njam;
