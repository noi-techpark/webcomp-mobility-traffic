import { i as ionicCoreGlobalScript } from './ionic-global-02d40d5a.js';
import './utils-866ef5ec.js';
import './animation-a90ce8fc.js';
import './index-e0b9067c.js';
import './ios.transition-2868be0f.js';
import './md.transition-30f75d4f.js';
import './cubic-bezier-89113939.js';
import './index-9b41fcc6.js';
import './index-86d5f3ab.js';
import './index-ad7a9473.js';
import './overlays-1f48760d.js';

const setupConfig = (config) => {
    const win = window;
    const Ionic = win.Ionic;
    if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
        console.error('ionic config was already initialized');
        return;
    }
    win.Ionic = win.Ionic || {};
    win.Ionic.config = Object.assign(Object.assign({}, win.Ionic.config), config);
    return win.Ionic.config;
};
const getMode = () => {
    const win = window;
    const config = win && win.Ionic && win.Ionic.config;
    if (config) {
        if (config.mode) {
            return config.mode;
        }
        else {
            return config.get('mode');
        }
    }
    return 'md';
};

setupConfig({
  mode: 'md',
  rippleEffect: false,
  animated: false
});
const globalFn = () => { };

const globalScripts = () => {
  globalFn();
  ionicCoreGlobalScript();
};

export { globalScripts as g };
