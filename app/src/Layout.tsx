import { Drawer, Icon, Menu, PageHeader } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import env from './env';

const Layout: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <PageHeader
        onBack={toggleOpen}
        title={env.appName}
        backIcon={<Icon type="menu" />}
      />
      <Drawer
        title="Navigation"
        placement="left"
        visible={open}
        onClose={toggleOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu onClick={toggleOpen} mode="inline" selectedKeys={['/']}>
          <Menu.Item key="/" title={<Icon type="unordered-list" />}>
            <NavLink to="/">Njams</NavLink>
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
};

export default Layout;
