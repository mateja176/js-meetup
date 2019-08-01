import { Drawer, Icon, Menu, PageHeader, Row } from 'antd';
import React from 'react';
import {
  NavLink,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import env from './env';
import Njams from './Njams';

const Layout: React.FC<RouteComponentProps> = ({ match: { path } }) => {
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
        <Menu onClick={toggleOpen} mode="inline" selectedKeys={[path]}>
          <Menu.Item key="/">
            <Row>
              <Icon type="unordered-list" style={{ marginRight: 10 }} />
              <NavLink to="/">Njams</NavLink>
            </Row>
          </Menu.Item>
        </Menu>
      </Drawer>
      <Switch>
        <Route path="/" component={Njams} />
      </Switch>
    </>
  );
};

export default withRouter(Layout);
