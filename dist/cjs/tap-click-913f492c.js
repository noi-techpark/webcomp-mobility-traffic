'use strict';

require('./index-eae2634f.js');
const noiBackdrop_noiButton_noiInput_noiMap_noiMobilityTraffic_noiPathDetails_noiSearch_noiStationItem_noiStationsModal_noiUrbanPath_entry = require('./noi-backdrop.noi-button.noi-input.noi-map.noi-mobility-traffic.noi-path-details.noi-search.noi-station-item.noi-stations-modal.noi-urban-path-8cb934fd.js');

const startTapClick = () => {
  let lastTouch = -MOUSE_WAIT * 10;
  let lastActivated = 0;
  let scrollingEl;
  let activatableEle;
  let activeDefer;
  const clearDefers = new WeakMap();
  const isScrolling = () => {
    return scrollingEl !== undefined && scrollingEl.parentElement !== null;
  };
  // Touch Events
  const onTouchStart = (ev) => {
    lastTouch = noiBackdrop_noiButton_noiInput_noiMap_noiMobilityTraffic_noiPathDetails_noiSearch_noiStationItem_noiStationsModal_noiUrbanPath_entry.now(ev);
    pointerDown(ev);
  };
  const onTouchEnd = (ev) => {
    lastTouch = noiBackdrop_noiButton_noiInput_noiMap_noiMobilityTraffic_noiPathDetails_noiSearch_noiStationItem_noiStationsModal_noiUrbanPath_entry.now(ev);
    pointerUp();
  };
  const onMouseDown = (ev) => {
    const t = noiBackdrop_noiButton_noiInput_noiMap_noiMobilityTraffic_noiPathDetails_noiSearch_noiStationItem_noiStationsModal_noiUrbanPath_entry.now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerDown(ev);
    }
  };
  const onMouseUp = (ev) => {
    const t = noiBackdrop_noiButton_noiInput_noiMap_noiMobilityTraffic_noiPathDetails_noiSearch_noiStationItem_noiStationsModal_noiUrbanPath_entry.now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerUp();
    }
  };
  const cancelActive = () => {
    clearTimeout(activeDefer);
    activeDefer = undefined;
    if (activatableEle) {
      removeActivated(false);
      activatableEle = undefined;
    }
  };
  const pointerDown = (ev) => {
    if (activatableEle || isScrolling()) {
      return;
    }
    scrollingEl = undefined;
    setActivatedElement(getActivatableTarget(ev));
  };
  const pointerUp = (ev) => {
    setActivatedElement(undefined);
  };
  const setActivatedElement = (el, ev) => {
    // do nothing
    if (el && el === activatableEle) {
      return;
    }
    clearTimeout(activeDefer);
    activeDefer = undefined;
    // deactivate selected
    if (activatableEle) {
      if (clearDefers.has(activatableEle)) {
        throw new Error('internal error');
      }
      if (!activatableEle.classList.contains(ACTIVATED)) {
        addActivated(activatableEle);
      }
      removeActivated(true);
    }
    // activate
    if (el) {
      const deferId = clearDefers.get(el);
      if (deferId) {
        clearTimeout(deferId);
        clearDefers.delete(el);
      }
      const delay = isInstant(el) ? 0 : ADD_ACTIVATED_DEFERS;
      el.classList.remove(ACTIVATED);
      activeDefer = setTimeout(() => {
        addActivated(el);
        activeDefer = undefined;
      }, delay);
    }
    activatableEle = el;
  };
  const addActivated = (el, _x, _y) => {
    lastActivated = Date.now();
    el.classList.add(ACTIVATED);
  };
  const removeActivated = (smooth) => {
    const active = activatableEle;
    if (!active) {
      return;
    }
    const time = CLEAR_STATE_DEFERS - Date.now() + lastActivated;
    if (smooth && time > 0 && !isInstant(active)) {
      const deferId = setTimeout(() => {
        active.classList.remove(ACTIVATED);
        clearDefers.delete(active);
      }, CLEAR_STATE_DEFERS);
      clearDefers.set(active, deferId);
    }
    else {
      active.classList.remove(ACTIVATED);
    }
  };
  const doc = document;
  doc.addEventListener('noiScrollStart', ev => {
    scrollingEl = ev.target;
    cancelActive();
  });
  doc.addEventListener('noiScrollEnd', () => {
    scrollingEl = undefined;
  });
  doc.addEventListener('noiGestureCaptured', cancelActive);
  doc.addEventListener('touchstart', onTouchStart, true);
  doc.addEventListener('touchcancel', onTouchEnd, true);
  doc.addEventListener('touchend', onTouchEnd, true);
  doc.addEventListener('mousedown', onMouseDown, true);
  doc.addEventListener('mouseup', onMouseUp, true);
};
const getActivatableTarget = (ev) => {
  if (ev.composedPath) {
    const path = ev.composedPath();
    for (let i = 0; i < path.length - 2; i++) {
      const el = path[i];
      if (el.classList && el.classList.contains('noi-activatable')) {
        return el;
      }
    }
  }
  else {
    return ev.target.closest('.noi-activatable');
  }
};
const isInstant = (el) => {
  return el.classList.contains('noi-activatable-instant');
};
const ACTIVATED = 'noi-activated';
const ADD_ACTIVATED_DEFERS = 200;
const CLEAR_STATE_DEFERS = 200;
const MOUSE_WAIT = 2500;

exports.startTapClick = startTapClick;
