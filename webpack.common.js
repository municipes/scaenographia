import fs from 'fs/promises';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import SvgChunkWebpackPlugin from 'svg-chunk-webpack-plugin';
import paths from './webpack.paths.js';
import semver from 'semver';
import packageJson from './package.json' with { type: 'json' };

if (!semver.satisfies(process.version, packageJson.engines.node)) {
  throw new Error(`The current Node.js version (${process.version}) does not satisfy the required version (${packageJson.engines.node}).`);
}

export default {
  // Entry
  entry: {
    // "bootstrap-italia": [`${paths.src}/js/index.js`, `${paths.src}/scss/theme.scss`],
    "bootstrap-italia-comuni": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni.scss'],
    "bootstrap-italia-comuni-acqua": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-acqua.scss'],
    "bootstrap-italia-comuni-acquamarina": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-acquamarina.scss'],
    "bootstrap-italia-comuni-amalfi": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-amalfi.scss'],
    "bootstrap-italia-comuni-amaranto": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-amaranto.scss'],
    "bootstrap-italia-comuni-apss": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-apss.scss'],
    "bootstrap-italia-comuni-blu": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-blu.scss'],
    "bootstrap-italia-comuni-cagliari": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-cagliari.scss'],
    "bootstrap-italia-comuni-cenerentola": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-cenerentola.scss'],
    "bootstrap-italia-comuni-elegance": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-elegance.scss'],
    "bootstrap-italia-comuni-firenze": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-firenze.scss'],
    "bootstrap-italia-comuni-mare": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-mare.scss'],
    "bootstrap-italia-comuni-mediterraneo": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-mediterraneo.scss'],
    "bootstrap-italia-comuni-roma": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-roma.scss'],
    "bootstrap-italia-comuni-rustico": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-rustico.scss'],
    "bootstrap-italia-comuni-sds": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-sds.scss'],
    "bootstrap-italia-comuni-trento": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-trento.scss'],
    "bootstrap-italia-comuni-turquoise": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-turquoise.scss'],
    "bootstrap-italia-comuni-verdone": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-verdone.scss'],
    "bootstrap-italia-comuni-warmred": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-warmred.scss'],
    "bootstrap-italia-comuni-rosso": [paths.src + '/js/index.js', paths.src + '/scss/theme-comuni-rosso.scss'],
    //"ckeditor5": `${paths.src}/scss/ckeditor5.scss`,
    "ckeditor5-comuni": paths.src + '/scss/ckeditor5-comuni.scss',
  },

  // Output
  output: {
    path: paths.build,
    filename: "js/[name].min.js",
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        include: [
          `${paths.modules}/bootstrap-italia/src/svg`,
          `${paths.src}/svg`,
        ],
        use: [
          {
            loader: SvgChunkWebpackPlugin.loader,
          },
        ],
      },
      // Uncomment if you use loading fonts via CSS https://git.drupalcode.org/project/bootstrap_italia#loading-fonts-via-css-advanced-users
      // {
      //   test: /\.(woff|woff2|eot|ttf|svg)$/,
      //   include: [
      //     paths.modules + '/bootstrap-italia/src/fonts',
      //   ],
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'fonts/[name]/[name][ext]',
      //   },
      // },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
      chunkFilename: 'css/[id].min.css',
    }),
    new SvgChunkWebpackPlugin({
      filename: 'svg/sprites.svg',
      svgstoreConfig: {
        svgAttrs: {
          'xmlns': 'http://www.w3.org/2000/svg',
        }
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${paths.modules}/bootstrap-italia/src/assets/`,
          to: `${paths.build}/assets/`,
        },
        {
          from: `${paths.modules}/bootstrap-italia/src/fonts/`,
          to: `${paths.build}/fonts/`,
        },
        {
          from: './src/images/',
          to: `${paths.build}/images/`,
        },
      ],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tapPromise('AfterEmitPlugin', async (compilation) => {
          const ckeditorJsFile = `${compiler.options.output.path}/js/ckeditor5.min.js`;
          try {
            await fs.rm(ckeditorJsFile, { force: true });
          } catch (err) {
            console.error('Error deleting ckeditor5.min.js:', err);
          }
        });
      },
    },
  ],
};
