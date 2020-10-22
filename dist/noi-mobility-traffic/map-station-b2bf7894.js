import { h } from './index-375c0366.js';
import { l as leafletSrc } from './leaflet-src-ee2a66f1.js';

const defaultPathOptions = {
  path: 'm7.773438.53125c3.988281 0 7.222656 3.101562 7.222656 6.929688 0 5.390624-7.222656 10.007812-7.222656 10.007812s-7.222657-4.617188-7.222657-10.007812c0-3.828126 3.234375-6.929688 7.222657-6.929688zm0 4.617188c-1.328126 0-2.40625 1.035156-2.40625 2.3125 0 1.273437 1.078124 2.308593 2.40625 2.308593 1.332031 0 2.410156-1.035156 2.410156-2.308593 0-1.277344-1.078125-2.3125-2.410156-2.3125zm0 0',
  iconSize: [18, 16],
  shadowSize: [18, 16],
};
class SvgPathIcon extends leafletSrc.Icon {
  constructor(options) {
    super(options);
    leafletSrc.Util.setOptions(this, defaultPathOptions);
    leafletSrc.Util.setOptions(this, options);
  }
  createIcon(oldIcon) {
    const div = (oldIcon && oldIcon.tagName === 'DIV' ? oldIcon : document.createElement('div'));
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
    const size = new leafletSrc.Point(this.options.iconSize[0], this.options.iconSize[1]);
    const anchor = this.options.iconAnchor ?
      new leafletSrc.Point(this.options.iconAnchor[0], this.options.iconAnchor[1]) :
      size.divideBy(2);
    this.setPosition(div, size, anchor);
    return div;
  }
  createShadow() {
    const div = document.createElement('div');
    div.className = this.options.className;
    const size = new leafletSrc.Point(this.options.shadowSize[0], this.options.shadowSize[1]);
    const anchor = this.options.shadowAnchor ?
      new leafletSrc.Point(this.options.shadowAnchor[0], this.options.shadowAnchor[1]) :
      size.divideBy(2);
    this.setPosition(div, size, anchor);
    return div;
  }
  setPosition(divEl, size, anchor) {
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

const MAP_ENTITY_MARKER = 'MAP_ENTITY_MARKER';
const MARKER_SIZE = 10;
const MapMarker = (props) => {
  const entityClass = {
    'noi-marker': true,
    'noi-marker--selected': props.selected,
    'noi-marker--start': props.isStart,
    'noi-marker--end': props.isEnd,
  };
  return (h("noi-map-entity", { "entity-type": MAP_ENTITY_MARKER, "entity-id": props.id, lat: props.coordinates.lat, long: props.coordinates.long, class: entityClass, style: { display: 'none' } },
    props.id,
    "-",
    props.name));
};
function highlightMarker(e) {
  const layer = e.target;
  layer.getElement().classList.add('noi-marker--hover');
}
function unHighlightMarker(e) {
  const layer = e.target;
  layer.getElement().classList.remove('noi-marker--hover');
}
function renderMarkerElement(e) {
  const lat = +e.getAttribute('lat');
  const long = +e.getAttribute('long');
  const icon = new SvgPathIcon({ className: e.getAttribute('class'), });
  const opts = {
    icon,
    zIndexOffset: 9999,
    opacity: 1
  };
  return new leafletSrc.Marker([lat, long], opts);
}

const MAP_ENTITY_STATION = 'MAP_ENTITY_STATION';
const STATION_CIRCLE_RADIUS = 12;
const MapStation = (props) => {
  const entityClass = {
    'noi-highway-station': true,
    'noi-highway-station--selected': props.selected,
    'noi-highway-station--start': props.isStart,
    'noi-highway-station--end': props.isEnd,
  };
  return (h("noi-map-entity", { "entity-type": MAP_ENTITY_STATION, "entity-id": props.id, lat: props.coordinates.lat, long: props.coordinates.long, class: entityClass, style: { display: 'none' } },
    props.id,
    "-",
    props.name));
};
function highlightHighwayStation(e) {
  const layer = e.target;
  layer.getElement().classList.add('noi-highway-station--hover');
  if (!leafletSrc.Browser.ie && !leafletSrc.Browser.opera && !leafletSrc.Browser.edge) {
    layer.bringToFront();
  }
}
function unHighlightHighwayStation(e) {
  const layer = e.target;
  layer.getElement().classList.remove('noi-highway-station--hover');
}
function renderHighwayStationElement(e) {
  const lat = +e.getAttribute('lat');
  const long = +e.getAttribute('long');
  const opts = {
    radius: STATION_CIRCLE_RADIUS,
    fill: true,
    fillRule: 'nonzero',
    className: e.getAttribute('class'),
    bubblingMouseEvents: false
  };
  return new leafletSrc.CircleMarker([lat, long], opts);
}

export { MapStation as M, MapMarker as a, MAP_ENTITY_STATION as b, MAP_ENTITY_MARKER as c, renderMarkerElement as d, highlightMarker as e, unHighlightMarker as f, highlightHighwayStation as h, renderHighwayStationElement as r, unHighlightHighwayStation as u };
