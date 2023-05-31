// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { BaseIconOptions, Icon, Point, Util } from 'leaflet';

export interface SvgIconOptions extends BaseIconOptions {
  viewBox?: string,
}

export interface SvgPathIconOptions extends SvgIconOptions {
  path?: string
}

const defaultPathOptions: SvgPathIconOptions = {
  path: 'm7.773438.53125c3.988281 0 7.222656 3.101562 7.222656 6.929688 0 5.390624-7.222656 10.007812-7.222656 10.007812s-7.222657-4.617188-7.222657-10.007812c0-3.828126 3.234375-6.929688 7.222657-6.929688zm0 4.617188c-1.328126 0-2.40625 1.035156-2.40625 2.3125 0 1.273437 1.078124 2.308593 2.40625 2.308593 1.332031 0 2.410156-1.035156 2.410156-2.308593 0-1.277344-1.078125-2.3125-2.410156-2.3125zm0 0',
  iconSize: [18, 16],
  shadowSize: [18, 16],
}

export class SvgPathIcon extends Icon<SvgPathIconOptions> {
  constructor(options: SvgPathIconOptions) {
    super(options)
    Util.setOptions(this, defaultPathOptions)
    Util.setOptions(this, options)
  }

  createIcon(oldIcon) {
    const div: HTMLDivElement = (oldIcon && oldIcon.tagName === 'DIV' ? oldIcon : document.createElement('div'))
    div.innerHTML = `<svg
      width="${this.options.iconSize[0]}"
      height="${this.options.iconSize[1]}px"
      viewBox="0 0 ${this.options.iconSize[1]} ${this.options.iconSize[0]}"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink">
        <path d="${this.options.path}"></path>
    </svg>`;
    div.className = this.options.className;
    const size = new Point(this.options.iconSize[0], this.options.iconSize[1]);
    const anchor = this.options.iconAnchor ? 
      new Point(this.options.iconAnchor[0], this.options.iconAnchor[1]) :
      size.divideBy(2);
    this.setPosition(div, size, anchor);
    return div;
  }

  createShadow() {
    const div = document.createElement('div');
    div.className = this.options.className;
    const size = new Point(this.options.shadowSize[0], this.options.shadowSize[1]);
    const anchor = this.options.shadowAnchor ?
      new Point(this.options.shadowAnchor[0], this.options.shadowAnchor[1]) :
      size.divideBy(2);
    this.setPosition(div, size, anchor);
    return div;
  }

  setPosition(divEl: HTMLDivElement, size?: Point, anchor?: Point) {
    if (anchor) {
      divEl.style.marginLeft = (-anchor.x) + 'px';
      divEl.style.marginTop = (-anchor.y) + 'px';
    }
    if (size) {
      divEl.style.width = size.x + 'px';
      divEl.style.height = size.y + 'px';
    }
  }
}
