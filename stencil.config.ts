import { Config } from '@stencil/core';
import dotEnvPlugin from 'rollup-plugin-dotenv';
import { sass } from '@stencil/sass';
import tsconfigPathsJest from 'tsconfig-paths-jest';
import tsconfig from './tsconfig.json';

export const config: Config = {
  namespace: 'noi-mobility-traffic',
  globalStyle: 'src/global/styles.css',
  testing: {
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    moduleNameMapper: tsconfigPathsJest(tsconfig),
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: "**/*.i18n.*.json",
          dest: "i18n"
        }
      ]
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: "**/*.i18n.*.json",
          dest: "i18n"
        }
      ]
    },
  ],
  plugins: [
    dotEnvPlugin(),
    sass()
  ]
};
