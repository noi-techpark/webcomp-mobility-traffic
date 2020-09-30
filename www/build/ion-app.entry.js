import { r as registerInstance, f as Build, l as h, m as Host, n as getElement } from './index-683b5499.js';
import { a as isPlatform, c as config, g as getIonMode } from './ionic-global-02d40d5a.js';

const appCss = "html.plt-mobile ion-app{user-select:none}ion-app.force-statusbar-padding{--ion-safe-area-top:20px}";

const App = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  componentDidLoad() {
    if (Build.isBrowser) {
      rIC(() => {
        const isHybrid = isPlatform(window, 'hybrid');
        if (!config.getBoolean('_testing')) {
          import('./tap-click-4e5957eb.js').then(module => module.startTapClick(config));
        }
        if (config.getBoolean('statusTap', isHybrid)) {
          import('./status-tap-bba71fd8.js').then(module => module.startStatusTap());
        }
        if (config.getBoolean('inputShims', needInputShims())) {
          import('./input-shims-1b8a7d4e.js').then(module => module.startInputShims(config));
        }
        if (config.getBoolean('hardwareBackButton', isHybrid)) {
          import('./hardware-back-button-b3b61715.js').then(module => module.startHardwareBackButton());
        }
        if (typeof window !== 'undefined') {
          import('./keyboard-563ae2fe.js').then(module => module.startKeyboardAssist(window));
        }
        import('./focus-visible-571e113e.js').then(module => module.startFocusVisible());
      });
    }
  }
  render() {
    const mode = getIonMode(this);
    return (h(Host, { class: {
        [mode]: true,
        'ion-page': true,
        'force-statusbar-padding': config.getBoolean('_forceStatusbarPadding'),
      } }));
  }
  get el() { return getElement(this); }
};
const needInputShims = () => {
  return isPlatform(window, 'ios') && isPlatform(window, 'mobile');
};
const rIC = (callback) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback);
  }
  else {
    setTimeout(callback, 32);
  }
};
App.style = appCss;

export { App as ion_app };
