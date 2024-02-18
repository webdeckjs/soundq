const { HtmlRspackPlugin, container: {ModuleFederationPlugin} } = require('@rspack/core');
const path = require('path');
const package = require('./package.json');

const isDevelopment = process.env.NODE_ENV === "development";
const name = `${isDevelopment? "local_" : ""}${package.name}`;
const port = 3002;

module.exports = {
  entry: './src/index',
  mode: 'development',
  target: 'web',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port,
    setupMiddlewares: (middlewares, devServer) => {
      console.log(`\x1b[32m[webdeck-plugin] Plugin url:\x1b[0m \x1b[36mhttp://localhost:${port}/remoteEntry.js?name=${name}\x1b[0m \n`)
      return middlewares;
    },
  },
  output: {
    publicPath:  "auto",
  },
  optimization:{
    minimize:false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'ecmascript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: name,
      filename: 'remoteEntry.js',
      exposes: {
        './Plugin': './src/App',
      },
      shared: {
        react: {
          requiredVersion: package.dependencies.react,
          import: 'react', // the "react" package will be used a provided and fallback module
          shareKey: 'react', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
        },
        'react-dom': {
          requiredVersion: package.dependencies['react-dom'],
          singleton: true, // only a single version of the shared module is allowed
        },
      },
    }),
    new HtmlRspackPlugin({
      template: './public/index.html',
    }),
  ],
};
