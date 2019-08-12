import { Drawer, Icon as AntIcon, Menu, PageHeader, Row } from 'antd';
import { IconProps as AntIconProps } from 'antd/lib/icon';
import { kebabCase, startCase } from 'lodash';
import React from 'react';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom';
import urlJoin from 'url-join';
import env from './env';
import { routeName, routePath } from './models';
import Njam, { CreateNjam } from './Njam';
import Njams from './Njams';
import SignIn from './SignIn';
import Users from './Users';

type IconProps = Omit<AntIconProps, 'type'>;

type Icon = React.FC<IconProps>;

interface IRoute {
  text: string;
  path: string;
  Icon: Icon;
  Component: React.ComponentType<RouteComponentProps>;
}

const mapPartialRoute = ({ text, ...route }: Omit<IRoute, 'path'>): IRoute => {
  return {
    ...route,
    text: startCase(text),
    path: urlJoin('/', kebabCase(text)),
  };
};

const routes: IRoute[] = [
  {
    text: routeName.njams,
    Icon: (props: IconProps) => <AntIcon {...props} type="unordered-list" />,
    Component: Njams,
  },
  {
    text: routeName.createNjam,
    Icon: (props: IconProps) => <AntIcon {...props} type="plus-circle" />,
    Component: CreateNjam,
  },
  {
    text: routeName.users,
    Icon: (props: IconProps) => <AntIcon {...props} type="user" />,
    Component: Users,
  },
].map(mapPartialRoute);

const Layout: React.FC<RouteComponentProps> = ({
  location: { pathname },
  history,
}) => {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);

  React.useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      history.push('/sign-in');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader
        onBack={toggleOpen}
        title={<NavLink to="/">{env.appName}</NavLink>}
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
        <Route path="/sign-in" component={SignIn} />
        <Route
          exact
          path="/"
          render={() => <Redirect to={routePath.njams} />}
        />
        {routes.map(({ path, Component }) => (
          <Route exact key={path} path={path} component={Component} />
        ))}
        <Route path={urlJoin(routePath.njams, ':id')} component={Njam} />
        <Route render={() => 'Not Found'} />
      </Switch>
    </>
  );
};

export default withRouter(Layout);
