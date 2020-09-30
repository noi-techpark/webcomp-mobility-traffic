import { Config } from '@stencil/core';
import dotEnvPlugin from 'rollup-plugin-dotenv';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'noi-mobility-traffic',
  globalStyle: 'src/global/styles.css',
  globalScript: 'src/global/ionic.ts',
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
    dotEnvPlugin(),
    sass({
      injectGlobalPaths: [
       'src/global/ionic-theme.scss'
     ]
   })
  ]
};
