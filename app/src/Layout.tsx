import { Drawer, Icon as AntIcon, Menu, PageHeader, Row } from 'antd';
import { IconProps } from 'antd/lib/icon';
import React from 'react';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import env from './env';
import Njams from './Njams';

type Icon = React.ComponentType<Omit<IconProps, 'type'>>;

interface IRoute {
  text: string;
  path: string;
  Icon: Icon;
  Component: React.ComponentType;
}

const routeTexts = ['njams'] as const;

const routes: IRoute[] = [
  {
    text: 'Njams',
    Icon: (props => <AntIcon {...props} type="unordered-list" />) as Icon,
    Component: Njams,
  },
].map(route => {
  const { text } = route;
  return {
    ...route,
    path: `/${text.toLowerCase()}`,
  };
});

const Layout: React.FC<RouteComponentProps> = ({ location: { pathname } }) => {
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <PageHeader
        onBack={toggleOpen}
        title={env.appName}
        backIcon={<AntIcon type="menu" />}
      />
      <Drawer
        title="Navigation"
        placement="left"
        visible={open}
        onClose={toggleOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu onClick={toggleOpen} mode="inline" selectedKeys={[pathname]}>
          {routes.map(({ text, path, Icon }) => (
            <Menu.Item key={path}>
              <Row>
                <Icon style={{ marginRight: 10 }} />
                <NavLink to={path}>{text}</NavLink>
              </Row>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
      <Switch>
        <Route path="/" render={() => <Redirect to="/njams" />} />
        {routes.map(({ path, Component }) => (
          <Route path={path} component={Component} />
        ))}
      </Switch>
    </>
  );
};

export default withRouter(Layout);
