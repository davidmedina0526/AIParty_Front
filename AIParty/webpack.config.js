// webpack.config.js
module.exports = ({ config }) => {
    if (!config.devServer) config.devServer = {};
    config.devServer.proxy = {
      '/api': {
        target: 'http://localhost:4000',
        secure: false,
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:4000',
        ws: true,
        secure: false,
        changeOrigin: true
      }
    };
    return config;
  };
  