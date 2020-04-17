const development = {
  api: process.env.REACT_APP_API,
  basename: '/',
};

const envs: Record<typeof process.env.NODE_ENV, typeof development> = {
  development,
  production: {
    ...development,
    // basename: '/njam-njam'
  },
  test: development,
};

export default envs[process.env.NODE_ENV];
