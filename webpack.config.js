const webpack = require('webpack')
const path = require('path')
const RemovePlugin = require('remove-files-webpack-plugin')

const buildPath = path.resolve(__dirname, 'dist')

const serverBuildPath = path.resolve(buildPath, 'server')

const clientBuildPath = path.resolve(buildPath, 'client')

const buildServer = {
  entry: './server/server.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({'global.GENTLY': false}),
    new RemovePlugin({
      before: {
        include: [serverBuildPath]
      },
      watch: {
        include: [serverBuildPath]
      }
    })
  ],
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    fileName: '[contenthash].server.js',
    path: serverBuildPath
  },
  target: 'node'
}

const buildClient = {
  entry: "./client/client.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: [clientBuildPath],
      },
      watch: {
        include: [clientBuildPath],
      },
    }),
  ],
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[contenthash].client.js",
    path: clientBuildPath,
  },
};

module.exports = [buildServer, buildClient]