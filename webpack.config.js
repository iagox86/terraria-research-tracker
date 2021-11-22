import path from 'path';
import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'browser'),
    filename: 'terraria-research-tracker.js',
    library: 'terrariaResearchTracker',
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // Of all weird things, this fixes a bug where an object has weird
          // broken UTF-8 keys, which makes Chrome and everything else balk
          safari10: true,
        },
      }),
    ],
  }
};
