const development = {
  api: 'http://localhost:4000',
};

const envs: Record<typeof process.env.NODE_ENV, typeof development> = {
  development,
  production: development,
  test: development,
};

export default envs[process.env.NODE_ENV];
