const development = {
  api: 'http://localhost:4000',
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
