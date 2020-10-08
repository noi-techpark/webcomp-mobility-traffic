import { EventEmitter } from '@stencil/core';

declare const __zone_symbol__requestAnimationFrame: any;
declare const requestAnimationFrame: any;

/**
 * Gets the root context of a shadow dom element
 * On newer browsers this will be the shadowRoot,
 * but for older browser this may just be the
 * element itself.
 *
 * Useful for whenever you need to explicitly
 * do "myElement.shadowRoot!.querySelector(...)".
 */
export const getElementRoot = (el: HTMLElement, fallback: HTMLElement = el) => {
  return el.shadowRoot || fallback;
};

export const hasShadowDom = (el: HTMLElement) => {
  return !!el.shadowRoot && !!(el as any).attachShadow;
};

export const findItemLabel = (componentEl: HTMLElement) => {
  const itemEl = componentEl.closest('noi-item');
  if (itemEl) {
    return itemEl.querySelector('noi-label');
  }
  return null;
};

export const renderHiddenInput = (always: boolean, container: HTMLElement, name: string, value: string | undefined | null, disabled: boolean) => {
  if (always || hasShadowDom(container)) {
    let input = container.querySelector('input.aux-input') as HTMLInputElement | null;
    if (!input) {
      input = container.ownerDocument!.createElement('input');
      input.type = 'hidden';
      input.classList.add('aux-input');
      container.appendChild(input);
    }
    input.disabled = disabled;
    input.name = name;
    input.value = value || '';
  }
};

export const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};


export const now = (ev: UIEvent) => {
  return ev.timeStamp || Date.now();
};

export const pointerCoord = (ev: any): { x: number, y: number } => {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (ev.pageX !== undefined) {
      return { x: ev.pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
};


export const deferEvent = (event: EventEmitter): EventEmitter => {
  return debounceEvent(event, 0);
};

export const debounceEvent = (event: EventEmitter, wait: number): EventEmitter => {
  const original = (event as any)._original || event;
  return {
    _original: event,
    emit: debounce(original.emit.bind(original), wait)
  } as EventEmitter;
};

export const debounce = (func: (...args: any[]) => void, wait = 0) => {
  let timer: any;
  return (...args: any[]): any => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};
