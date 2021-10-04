import { Config } from '@stencil/core';
import dotEnvPlugin from 'rollup-plugin-dotenv';
import { sass } from '@stencil/sass';
import tsconfigPathsJest from 'tsconfig-paths-jest';
import tsconfig from './tsconfig.json';

export const config: Config = {
  namespace: 'noi-mobility-traffic',
  testing: {
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    moduleNameMapper: tsconfigPathsJest(tsconfig),
  },
  bundles: [
    { components: [
      'noi-backdrop',
      'noi-mobility-traffic',
      'noi-map',
      'noi-path-details',
      'noi-search',
      'noi-station-item',
      'noi-stations-modal',
      'noi-urban-path',
      'noi-button',
      'noi-input'
      ]
    },
  ],
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      buildDir: '',
      dir: 'cdn',
      baseUrl: 'http://localhost:8080/noi/',
      copy: [
        {
          src: "../i18n/*.i18n.*.json",
          dest: "."
        },
        {
          src: "../data/*.json",
          dest: "."
        },
        {
          src: "../assets/*.svg",
          dest: "."
        }
      ]
    },
  ],
  plugins: [
    dotEnvPlugin(),
    sass()
  ]
};
