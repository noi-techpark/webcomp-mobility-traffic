import { r as registerInstance, h, e as getElement } from './index-54a7bd8b.js';
import './index-0fe06bad.js';
import { l as leafletSrc } from './leaflet-src-ee2a66f1.js';
import { s as state, t as translate } from './index-ef27915b.js';
import { b as MAP_ENTITY_STATION, c as MAP_ENTITY_MARKER, r as renderHighwayStationElement, h as highlightHighwayStation, u as unHighlightHighwayStation, d as renderMarkerElement, e as highlightMarker, f as unHighlightMarker } from './map-station-72107a10.js';

class MapEntityFactory {
  constructor(map) {
    this.map = map;
  }
  createLayer(e) {
    const type = e.getAttribute('entity-type');
    if (type === MAP_ENTITY_STATION) {
      return this.createStation(e);
    }
    if (type === MAP_ENTITY_MARKER) {
      return this.createMarker(e);
    }
  }
  createStation(e) {
    const id = e.getAttribute('entity-id');
    const result = renderHighwayStationElement(e);
    result.on({
      mouseover: highlightHighwayStation,
      mouseout: unHighlightHighwayStation,
      click: (e) => {
        const latLong = e.target.getLatLng();
        this.map.panTo(latLong);
        state.selectedId = id;
        state.mapPopup = true;
      }
    });
    return result;
  }
  createMarker(e) {
    const id = e.getAttribute('entity-id');
    const result = renderMarkerElement(e);
    result.on({
      mouseover: highlightMarker,
      mouseout: unHighlightMarker,
      click: (e) => {
        const latLong = e.target.getLatLng();
        this.map.panTo(latLong);
        state.selectedId = id;
        state.mapPopup = true;
      }
    });
    return result;
  }
}

const mapCss = ":host{height:100%;width:100%;overflow:hidden;position:relative}.popup-container{min-width:200px;padding:8px;opacity:0;height:auto;-webkit-transition:all 0.5s;transition:all 0.5s}.popup-container--visible{opacity:1;-webkit-transition:all 0.5s;transition:all 0.5s}.station-popup{display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:8px}.station-popup__header{height:40px;line-height:40px;color:#346e97;font-size:large;width:100%;text-align:center;text-transform:uppercase}.station-popup__content{display:flex;flex-direction:row;width:100%;padding:0 8px}.station-popup__btn{--background:var(--noi-action);--color:var(--noi-action-contrast);flex:1}.noi-map-path{stroke:var(--noi-action);stroke-dasharray:6px;stroke-width:5px}.noi-marker{position:absolute;opacity:1.0;fill-opacity:1}.noi-marker>svg{position:absolute;top:0;left:0}.noi-marker:before{content:'';position:relative;display:block;width:300%;padding-top:300%;box-sizing:border-box;margin-left:-100%;margin-top:-100%;border-radius:50%;animation:pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite}@keyframes pulse-ring{0%{transform:scale(.63)}80%,100%{opacity:0}}.noi-marker--start{fill:var(--noi-primary)}.noi-marker--start:before{background-color:rgba(var(--noi-primary-rgb), 0.8)}.noi-marker--end{fill:var(--noi-action)}.noi-marker--end:before{background-color:rgba(var(--noi-action-rgb), 0.8)}.noi-highway-station{stroke-width:4;stroke:var(--noi-primary);fill:var(--noi-primary-contrast);opacity:1.0;fill-opacity:1}.noi-highway-station--hover{stroke:var(--noi-action)}.noi-highway-station--selected{stroke:#fff;fill:var(--noi-primary)}.noi-highway-station--start{stroke-width:4;stroke:var(--noi-primary);fill:var(--noi-primary-contrast)}.noi-highway-station--end{stroke-width:4;stroke:var(--noi-action);fill:var(--noi-action-contrast)}.leaflet-tile-pane{-webkit-filter:grayscale(100%);filter:grayscale(100%)}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg,.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none !important;max-height:none !important}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51, 181, 229, 0.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-tile{will-change:opacity}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity 0.5s linear;-moz-transition:opacity 0.5s linear;transition:opacity 0.5s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}.leaflet-zoom-anim .leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform 0.25s cubic-bezier(0,0,0.25,1);-moz-transition:-moz-transform 0.25s cubic-bezier(0,0,0.25,1);transition:transform 0.25s cubic-bezier(0,0,0.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline:0}.leaflet-container a{color:#0078A8}.leaflet-container a.leaflet-active{outline:2px solid orange}.leaflet-zoom-box{border:2px dotted #38f;background:rgba(255,255,255,0.5)}.leaflet-container{font:12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif}.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,0.65);border-radius:4px}.leaflet-bar a,.leaflet-bar a:hover{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:black}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px 'Lucida Console', Monaco, monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px rgba(0,0,0,0.4);background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(images/layers.png);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(images/layers-2x.png);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(images/marker-icon.png)}.leaflet-container .leaflet-control-attribution{background:#fff;background:rgba(255, 255, 255, 0.7);margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover{text-decoration:underline}.leaflet-container .leaflet-control-attribution,.leaflet-container .leaflet-control-scale{font-size:11px}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;font-size:11px;white-space:nowrap;overflow:hidden;-moz-box-sizing:border-box;box-sizing:border-box;background:#fff;background:rgba(255, 255, 255, 0.5)}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,0.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:40px}.leaflet-popup-content-wrapper{padding:1px;text-align:left}.leaflet-popup-content{margin:0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:white;color:#333;box-shadow:0 3px 14px rgba(0,0,0,0.4)}.leaflet-container a.leaflet-popup-close-button{display:none}.leaflet-popup-scrolled{overflow:auto;border-bottom:1px solid #ddd;border-top:1px solid #ddd}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)}.leaflet-oldie .leaflet-popup-tip-container{margin-top:-1px}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,0.4)}.leaflet-tooltip.leaflet-clickable{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}";

function isNotAssigned(value) {
  return value === undefined || value === null || isNaN(value);
}
const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const NoiMap = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.map = null;
    this.userMarker = null;
    this.childrenObserver = null;
    this.entityChildren = new WeakMap();
    this.pathChildren = new WeakMap();
    this.popupTimer = null;
    this.showPopup = false;
    this.lat = 46.4983;
    this.long = 11.3548;
    this.scale = 13;
  }
  componentDidLoad() {
    this.map = new leafletSrc.Map(this.el, { zoomControl: false });
    this.entityFactory = new MapEntityFactory(this.map);
    this.updateCenterAndZoom();
    new leafletSrc.TileLayer(TILE_LAYER).addTo(this.map);
    this.renderChildren();
    this.childrenObserver = new MutationObserver((mutations) => this.childrenObserverCallback(mutations));
    this.childrenObserver.observe(this.el, { attributes: false, childList: true, subtree: false });
  }
  disconnectedCallback() {
    this.childrenObserver.disconnect();
  }
  latHandler(newValue, _oldValue) {
    if (isNotAssigned(newValue)) {
      return;
    }
    this.updateCenterAndZoom();
  }
  longHandler(newValue, _oldValue) {
    if (isNotAssigned(newValue)) {
      return;
    }
    this.updateCenterAndZoom();
  }
  scaleHandler(newValue, _oldValue) {
    this.scale = newValue;
    this.updateCenterAndZoom();
  }
  entityAttrsObserver(el, mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes')
        continue;
      if (['lat', 'long'].includes(mutation.attributeName)) {
        this.entityChildren.get(el).layer.setLatLng([el.getAttribute('lat'), el.getAttribute('long')]);
      }
      if (['class'].includes(mutation.attributeName)) {
        const layer = this.entityChildren.get(el).layer;
        const newClasses = (el.getAttribute('class') + '').split(' ');
        const oldClasses = (layer.getElement().classList.value + '').split(' ').filter(c => !c.startsWith('leaflet-'));
        oldClasses.forEach(c => {
          layer.getElement().classList.remove(c);
        });
        newClasses.forEach(c => {
          layer.getElement().classList.add(c);
        });
      }
    }
  }
  childrenObserverCallback(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList')
        continue;
      this.removeChildren(mutation.removedNodes);
      this.renderChildren();
    }
  }
  removeChildren(nodes) {
    nodes.forEach(node => {
      if (!node.nodeName.startsWith("NOI-")) {
        return;
      }
      const entityEl = this.entityChildren.get(node);
      if (entityEl) {
        this.map.removeLayer(entityEl.layer);
        if (entityEl.observer)
          entityEl.observer.disconnect();
        this.entityChildren.delete(node);
        return;
      }
      const pathEl = this.pathChildren.get(node);
      if (pathEl) {
        this.map.removeLayer(pathEl.layer);
        if (pathEl.observer) {
          pathEl.observer.disconnect();
        }
        this.pathChildren.delete(node);
        return;
      }
    });
  }
  renderMapEntity(e) {
    const layer = this.entityFactory.createLayer(e);
    const observer = new MutationObserver((mutations, _observer) => this.entityAttrsObserver(e, mutations));
    observer.observe(e, { attributes: true, childList: false, subtree: false });
    this.entityChildren.set(e, { layer, observer });
    layer.addTo(this.map);
    layer.bindPopup(this.popupElement, { minWidth: 400 });
    layer.getPopup().on('remove', () => state.selectedId = '');
  }
  renderGeoJson(e) {
    const geometry = JSON.parse(e.getAttribute('geometry'));
    const layer = new leafletSrc.GeoJSON(geometry, {
      style: {
        className: 'noi-map-path',
      },
    });
    this.pathChildren.set(e, { layer, observer: null });
    layer.addTo(this.map);
  }
  renderChildren() {
    Array.from(this.el.children).map(e => {
      if (this.entityChildren.get(e) !== undefined) {
        return;
      }
      if (this.pathChildren.get(e) !== undefined) {
        return;
      }
      switch (e.nodeName) {
        case 'NOI-MAP-ENTITY':
          this.renderMapEntity(e);
          break;
        case 'NOI-MAP-ROUTE':
          this.renderGeoJson(e);
          break;
        default:
          break;
      }
    });
  }
  updateCenterAndZoom() {
    if (isNotAssigned(this.lat) || isNotAssigned(this.long)) {
      return;
    }
    this.map.setView([this.lat, this.long], this.scale);
  }
  onSetAsStart() {
    state.startId = state.selectedId;
    state.selectedId = '';
    this.map.closePopup();
  }
  onSetAsEnd() {
    state.endId = state.selectedId;
    state.selectedId = '';
    this.map.closePopup();
  }
  renderSetAsStartButton() {
    if (state.selectedId === state.startId) {
      return null;
    }
    return (h("noi-button", { fill: "solid", class: "button-md station-popup__btn", onClick: this.onSetAsStart.bind(this) }, translate('map-popup.from')));
  }
  renderSetAsEndButton() {
    if (state.selectedId === state.endId) {
      return null;
    }
    return (h("noi-button", { fill: "solid", class: "button-md station-popup__btn", onClick: this.onSetAsEnd.bind(this) }, translate('map-popup.to')));
  }
  renderSelectedStationPopup() {
    return (h("div", { class: "station-popup" }, h("div", { class: "station-popup__header" }, state.selectedId ? state.selected.name : ''), h("div", { class: "station-popup__content" }, this.renderSetAsStartButton(), this.renderSetAsEndButton())));
  }
  render() {
    const popupClass = {
      'popup-container': true,
      'popup-container--visible': state.mapPopup
    };
    return h("div", { class: popupClass, ref: (el) => this.popupElement = el }, this.renderSelectedStationPopup());
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "lat": ["latHandler"],
    "long": ["longHandler"],
    "scale": ["scaleHandler"]
  }; }
};
NoiMap.style = mapCss;

export { NoiMap as noi_map };
