/**
 *
 * @author Xuan
 * @since 2024/11/30 上午 01:01
 */
import path from 'node:path';
import { module } from './webpack.common.config.mjs';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**@type {import('webpack').Configuration | {devServer:import('webpack-dev-server').Configuration} } */
const config = {
  mode: 'development',
  entry: {
    index: './src/main.tsx',
  },
  devtool: 'source-map',
  module: module,
  resolve: {
    extensions: ['.js', '.mjs', '.ts', '.tsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'DevApp',
      filename: 'index.html',
      template: path.join(__dirname, 'index.html')
    })
  ],
  devServer: {
    host: '127.0.0.1',
    port: '9001',
    hot: true,
    client: {
      overlay: {
        errors: false
      }
    },
  }
};

export default config;