const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = (config, env) => {
  const hotConfig = rewireReactHotLoader(config, env);

  hotConfig.module.rules.push({
    test: /\.jsx?$/,
    include: /node_modules/,
    use: ['react-hot-loader/webpack'],
  });

  return hotConfig;
};
