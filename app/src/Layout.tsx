import { Drawer, Icon as AntIcon, Menu, PageHeader, Row } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { capitalize } from 'lodash';
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
import Njam from './Njam';
import Njams from './Njams';

type Icon = React.ComponentType<Omit<IconProps, 'type'>>;

interface IRoute {
  text: string;
  path: string;
  Icon: Icon;
  Component: React.ComponentType<RouteComponentProps>;
}

const routeTexts = ['njams'] as const;

type RouteText = typeof routeTexts[number];

const routeText = routeTexts.reduce(
  (_routeText, text) => ({ ..._routeText, [text]: text }),
  {} as { [text in RouteText]: text },
);

const routes: IRoute[] = [
  {
    text: routeText.njams,
    Icon: (props => <AntIcon {...props} type="unordered-list" />) as Icon,
    Component: Njams,
  },
].map(({ text, ...route }) => {
  return {
    ...route,
    text: capitalize(text),
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
        <Route
          exact
          path="/"
          render={() => <Redirect to={`/${routeText.njams}`} />}
        />
        {routes.map(({ path, Component }) => (
          <Route exact key={path} path={path} component={Component} />
        ))}
        <Route path={`/${routeText.njams}/:id`} component={Njam} />
      </Switch>
    </>
  );
};

export default withRouter(Layout);
