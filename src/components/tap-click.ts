// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { now, pointerCoord } from './helpers';

export const startTapClick = () => {
  let lastTouch = -MOUSE_WAIT * 10;
  let lastActivated = 0;
  let scrollingEl: HTMLElement | undefined;

  let activatableEle: HTMLElement | undefined;
  let activeDefer: any;

  const clearDefers = new WeakMap<HTMLElement, any>();

  const isScrolling = () => {
    return scrollingEl !== undefined && scrollingEl.parentElement !== null;
  };

  // Touch Events
  const onTouchStart = (ev: TouchEvent) => {
    lastTouch = now(ev);
    pointerDown(ev);
  };

  const onTouchEnd = (ev: TouchEvent) => {
    lastTouch = now(ev);
    pointerUp(ev);
  };

  const onMouseDown = (ev: MouseEvent) => {
    const t = now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerDown(ev);
    }
  };

  const onMouseUp = (ev: MouseEvent) => {
    const t = now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerUp(ev);
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

  const pointerDown = (ev: any) => {
    if (activatableEle || isScrolling()) {
      return;
    }
    scrollingEl = undefined;
    setActivatedElement(getActivatableTarget(ev), ev);
  };

  const pointerUp = (ev: UIEvent) => {
    setActivatedElement(undefined, ev);
  };

  const setActivatedElement = (el: HTMLElement | undefined, ev: UIEvent) => {
    // do nothing
    if (el && el === activatableEle) {
      return;
    }
    clearTimeout(activeDefer);
    activeDefer = undefined;

    const { x, y } = pointerCoord(ev);

    // deactivate selected
    if (activatableEle) {
      if (clearDefers.has(activatableEle)) {
        throw new Error('internal error');
      }
      if (!activatableEle.classList.contains(ACTIVATED)) {
        addActivated(activatableEle, x, y);
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
        addActivated(el, x, y);
        activeDefer = undefined;
      }, delay);
    }
    activatableEle = el;
  };

  const addActivated = (el: HTMLElement, _x: number, _y: number) => {
    lastActivated = Date.now();
    el.classList.add(ACTIVATED);
  };

  const removeActivated = (smooth: boolean) => {
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
    } else {
      active.classList.remove(ACTIVATED);
    }
  };

  const doc = document;
  doc.addEventListener('noiScrollStart', ev => {
    scrollingEl = ev.target as HTMLElement;
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

const getActivatableTarget = (ev: any): any => {
  if (ev.composedPath) {
    const path = ev.composedPath() as HTMLElement[];
    for (let i = 0; i < path.length - 2; i++) {
      const el = path[i];
      if (el.classList && el.classList.contains('noi-activatable')) {
        return el;
      }
    }
  } else {
    return ev.target.closest('.noi-activatable');
  }
};

const isInstant = (el: HTMLElement) => {
  return el.classList.contains('noi-activatable-instant');
};

const ACTIVATED = 'noi-activated';
const ADD_ACTIVATED_DEFERS = 200;
const CLEAR_STATE_DEFERS = 200;
const MOUSE_WAIT = 2500;
