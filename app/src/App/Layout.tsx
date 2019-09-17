import {
  Drawer,
  Icon as AntIcon,
  Menu,
  PageHeader,
  Row,
  Typography,
} from 'antd';
import { IconProps as AntIconProps } from 'antd/lib/icon';
import { kebabCase, startCase } from 'lodash';
import { isEmpty } from 'ramda';
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
import env from '../env';
import { useUserIdsQuery } from '../generated/graphql';
import { publicRoutePath, routeName, routePath } from '../models';
import Njam, { CreateNjam } from '../pages/Njam';
import Njams from '../pages/Njams';
import SignIn from '../pages/SignIn';
import Users from '../pages/Users';

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

  const userIdsQueryResult = useUserIdsQuery();
  const { data } = userIdsQueryResult;

  React.useEffect(() => {
    // not using `useUserId` because the value is `''` initially and as such is falsy
    const userId = localStorage.getItem('userId') || '';

    if (!userId) {
      history.push(publicRoutePath.signIn);
    }
    // use of isEmpty is explained here https://github.com/apollographql/react-apollo/issues/3192
    if (!isEmpty(data)) {
      const { users } = data!;

      if (!users.map(({ id }) => id).includes(userId)) {
        history.push(publicRoutePath.signIn);
      }
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <NavLink to={path}>
                <Row>
                  <Icon style={{ marginRight: 10 }} />
                  <Typography.Text>{text}</Typography.Text>
                </Row>
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
      <Switch>
        <Route path={publicRoutePath.signIn} component={SignIn} />
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
