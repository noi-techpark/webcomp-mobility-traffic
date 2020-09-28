import { Config } from '@stencil/core';
import dotEnvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  namespace: 'noi-mobility-traffic',
  globalStyle: 'src/global/variables.css',
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
      type: 'dist-custom-elements-bundle',
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
    dotEnvPlugin()
  ]
};
