/**
 *
 * @author Xuan
 * @since 2024/11/30 上午 01:00
 */
import path from 'node:path';
import { module } from './webpack.common.config.mjs';
import { fileURLToPath } from 'node:url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**@type import('webpack').Configuration */
const config = {
  mode: 'production',
  entry: {
    index: './src/main.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: false,
  module: module,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module.identifier().split(path.sep).reduceRight((item) => item);
            const allChunksNames = chunks.map((item) => item.name).join('~');
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          },
          chunks: 'all',
          priority: -1,
        },
        react: {
          test: /[\\/]node_modules[\\/].*react.*$/,
          name: 'react',
          chunks: 'all',
          priority: 0,
        }
      },
    },
  },
  resolve: {
    extensions: ['.js', '.mjs', '.ts', '.tsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'App',
      filename: 'index.html',
      template: path.join(__dirname, 'index.html')
    }),
  ],
};

export default config;