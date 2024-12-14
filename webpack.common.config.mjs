/**
 *
 * @author Xuan
 * @since 2024/11/30 上午 01:01
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**@type import('webpack').ModuleOptions */
const module = {
  rules: [
    {
      test: /.(ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          configFile: path.join(__dirname, '.babelrc')
        }
      },
      exclude: /node_modules/
    },
    {
      test: /\.less/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[local]-[hash:base64:3]',
              exportLocalsConvention: 'camelCaseOnly',
              namedExport: false,
            }
          }
        },
        'less-loader',
      ]
    },
    {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/i,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'static'
      }
    }
  ]
};

export { module };