import { r as registerInstance, g as getElement } from './index-eae66176.js';
import { l as leafletSrc } from './leaflet-src-ee2a66f1.js';

const mapCss = "noi-mobility-map{height:100%;width:100%;overflow:hidden}.leaflet-tile-pane{-webkit-filter:grayscale(100%);filter:grayscale(100%)}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg,.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none !important;max-height:none !important}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51, 181, 229, 0.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-tile{will-change:opacity}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity 0.2s linear;-moz-transition:opacity 0.2s linear;transition:opacity 0.2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}.leaflet-zoom-anim .leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform 0.25s cubic-bezier(0,0,0.25,1);-moz-transition:-moz-transform 0.25s cubic-bezier(0,0,0.25,1);transition:transform 0.25s cubic-bezier(0,0,0.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline:0}.leaflet-container a{color:#0078A8}.leaflet-container a.leaflet-active{outline:2px solid orange}.leaflet-zoom-box{border:2px dotted #38f;background:rgba(255,255,255,0.5)}.leaflet-container{font:12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif}.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,0.65);border-radius:4px}.leaflet-bar a,.leaflet-bar a:hover{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:black}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px 'Lucida Console', Monaco, monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px rgba(0,0,0,0.4);background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(images/layers.png);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(images/layers-2x.png);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(images/marker-icon.png)}.leaflet-container .leaflet-control-attribution{background:#fff;background:rgba(255, 255, 255, 0.7);margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover{text-decoration:underline}.leaflet-container .leaflet-control-attribution,.leaflet-container .leaflet-control-scale{font-size:11px}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;font-size:11px;white-space:nowrap;overflow:hidden;-moz-box-sizing:border-box;box-sizing:border-box;background:#fff;background:rgba(255, 255, 255, 0.5)}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,0.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 19px;line-height:1.4}.leaflet-popup-content p{margin:18px 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:white;color:#333;box-shadow:0 3px 14px rgba(0,0,0,0.4)}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;padding:4px 4px 0 0;border:none;text-align:center;width:18px;height:14px;font:16px/14px Tahoma, Verdana, sans-serif;color:#c3c3c3;text-decoration:none;font-weight:bold;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover{color:#999}.leaflet-popup-scrolled{overflow:auto;border-bottom:1px solid #ddd;border-top:1px solid #ddd}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)}.leaflet-oldie .leaflet-popup-tip-container{margin-top:-1px}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,0.4)}.leaflet-tooltip.leaflet-clickable{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}";

const LeafletMarker = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.lmap = null;
    this.dmarker = null;
    this.userMarker = null;
    this.observer = null;
    this.children = new WeakMap();
    this.tileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.iconUrl = '';
    this.iconHeight = 32;
    this.iconWidth = 32;
    this.latitude = 46.4983;
    this.longitude = 11.3548;
    this.scale = 13;
    this.userLatitude = 0;
    this.userLongitude = 0;
    this.userIconUrl = '';
    this.userIconWidth = 0;
    this.userIconHeight = 0;
  }
  componentDidLoad() {
    this.lmap = leafletSrc.map(this.el, { zoomControl: false });
    this.setView();
    this.setTileLayer();
    this.setScale();
    this.setChildren();
    this.setDefaultMarker();
    this.setUserMarker();
    this.observer = new MutationObserver((mutations, _observer) => this.childrenObserver(mutations));
    this.observer.observe(this.el, { attributes: false, childList: true, subtree: false });
  }
  disconnectedCallback() {
    this.observer.disconnect();
  }
  defaultPopupHandler(newValue, _oldValue) {
    this.defaultPopup = newValue;
    this.setDefaultIcon();
    this.updateDefaultPopup();
  }
  iconHeightHandler(newValue, _oldValue) {
    this.iconHeight = newValue;
    this.setDefaultIcon();
  }
  iconUrlHandler(newValue, _oldValue) {
    this.iconUrl = newValue;
    this.setDefaultIcon();
  }
  iconWidthHandler(newValue, _oldValue) {
    this.iconWidth = newValue;
    this.setDefaultIcon();
  }
  latitudeHandler(newValue, _oldValue) {
    this.latitude = newValue;
    this.setView();
    this.updateDefaultMarker();
    this.updateDefaultPopup();
  }
  longitudeHandler(newValue, _oldValue) {
    this.longitude = newValue;
    this.setView();
    this.updateDefaultMarker();
    this.updateDefaultPopup();
  }
  scaleHandler(newValue, _oldValue) {
    this.scale = newValue;
    this.setView();
  }
  userLatitudeHandler(newValue, _oldValue) {
    this.userLatitude = newValue;
    this.updateUserMarker();
  }
  userLongitudeHandler(newValue, _oldValue) {
    this.userLongitude = newValue;
    this.updateUserMarker();
  }
  userIconUrlHandler(newValue, _oldValue) {
    this.userIconUrl = newValue;
    this.updateUserMarker();
  }
  userIconWidthHandler(newValue, _oldValue) {
    this.userIconWidth = newValue;
    this.updateUserMarker();
  }
  userIconHeightHandler(newValue, _oldValue) {
    this.userIconHeight = newValue;
    this.updateUserMarker();
  }
  updateUserMarker() {
    if (this.userLatitude === undefined || this.userLatitude === null || isNaN(this.userLatitude) ||
      this.userLongitude === undefined || this.userLongitude === null || isNaN(this.userLongitude))
      return;
    this.userMarker.setLatLng([this.userLatitude, this.userLongitude]);
    if (!this.userIconUrl)
      return;
    const icon = leafletSrc.icon({
      iconUrl: this.userIconUrl,
      iconSize: [this.userIconWidth || 32, this.userIconHeight || 32]
    });
    this.userMarker.setIcon(icon);
  }
  setUserMarker() {
    if (this.userLatitude === undefined || this.userLatitude === null || isNaN(this.userLatitude) ||
      this.userLongitude === undefined || this.userLongitude === null || isNaN(this.userLongitude))
      return;
    this.userMarker = leafletSrc.marker([this.userLatitude, this.userLongitude]);
    this.userMarker.addTo(this.lmap);
    if (!this.userIconUrl)
      return;
    const icon = leafletSrc.icon({
      iconUrl: this.userIconUrl,
      iconSize: [this.userIconWidth || 32, this.userIconHeight || 32]
    });
    this.userMarker.setIcon(icon);
  }
  attributesObserver(el, mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'attributes')
        continue;
      if (['latitude', 'longitude'].includes(mutation.attributeName)) {
        this.children.get(el).layer.setLatLng([el.getAttribute('latitude'), el.getAttribute('longitude')]);
      }
      if (['icon-height', 'icon-url', 'icon-width'].includes(mutation.attributeName)) {
        const icon = this.getIcon(el);
        this.children.get(el).layer.setIcon(icon);
      }
    }
  }
  childrenObserver(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type !== 'childList')
        continue;
      this.removeChildren(mutation.removedNodes);
      this.setChildren();
    }
  }
  getIcon(el) {
    return leafletSrc.icon({
      iconUrl: el.getAttribute('icon-url'),
      iconSize: [el.getAttribute('icon-width') || 32, el.getAttribute('icon-height') || 32]
    });
  }
  removeChildren(nodes) {
    nodes.forEach(node => {
      if (!node.nodeName.startsWith("LEAFLET-"))
        return;
      const el = this.children.get(node);
      this.lmap.removeLayer(el.layer);
      if (el.observer)
        el.observer.disconnect();
      this.children.delete(node);
    });
  }
  renderMarker(e, observeProps = false) {
    if (e.nodeName !== 'LEAFLET-MARKER') {
      return;
    }
    const observer = observeProps ? new MutationObserver((mutations, _observer) => this.attributesObserver(e, mutations)) : null;
    observer && observer.observe(e, { attributes: true, childList: false, subtree: false });
    const marker = {
      layer: leafletSrc.marker([e.getAttribute('latitude'), e.getAttribute('longitude')]),
      observer,
    };
    this.children.set(e, marker);
    marker.layer.addTo(this.lmap);
    if (e.textContent) {
      marker.layer.bindPopup(e.textContent).openPopup();
    }
    if (e.getAttribute('icon-url')) {
      const icon = this.getIcon(e);
      marker.layer.setIcon(icon);
    }
  }
  renderHighwayStation(e) {
    if (e.nodeName !== 'HIGHWAY-STATION') {
      return;
    }
    const opts = {
      radius: e.getAttribute('radius'),
      stroke: e.hasAttribute('stroke'),
      color: e.hasAttribute('color') ? e.getAttribute('color') : '#5b879f',
      opacity: e.hasAttribute('opacity') ? e.getAttribute('opacity') : 1.0,
      fill: e.hasAttribute('fill') && e.getAttribute('fill') === 'false' ? false : true,
      fillColor: e.hasAttribute('fill-color') ? e.getAttribute('fill-color') : '#88b2ca',
      fillOpacity: e.hasAttribute('fill-opacity') ? e.getAttribute('fill-opacity') : 0.8,
      fillRule: e.hasAttribute('fill-rule') ? e.getAttribute('fill-rule') : 'nonzero',
      bubblingMouseEvents: e.hasAttribute('bubbling-mouse-events'),
    };
    const circle = leafletSrc.circleMarker([e.getAttribute('latitude'), e.getAttribute('longitude')], opts);
    this.children.set(e, circle);
    circle.addTo(this.lmap);
    if (e.textContent) {
      circle.bindPopup(e.textContent).openPopup();
    }
  }
  renderGeoJson(e) {
    if (e.nodeName !== 'LEAFLET-GEOJSON') {
      return;
    }
    const geometry = JSON.parse(e.getAttribute('geometry'));
    const line = leafletSrc.geoJSON(geometry, geometry);
    this.children.set(e, line);
    line.addTo(this.lmap);
  }
  setChildren() {
    Array.from(this.el.children).map(e => {
      if (this.children.get(e) !== undefined) {
        return;
      }
      switch (e.nodeName) {
        case 'LEAFLET-MARKER':
          this.renderMarker(e);
          break;
        case 'HIGHWAY-STATION':
          this.renderHighwayStation(e);
          break;
        case 'LEAFLET-GEOJSON':
          this.renderGeoJson(e);
          break;
        default:
          break;
      }
    });
  }
  setDefaultIcon() {
    if (this.iconUrl) {
      const icon = leafletSrc.icon({
        iconUrl: this.iconUrl,
        iconSize: [this.iconWidth, this.iconHeight]
      });
      this.dmarker.setIcon(icon);
    }
  }
  setDefaultMarker() {
    if (this.showDefaultMarker) {
      if (this.defaultPopup) {
        this.dmarker = leafletSrc.marker([this.latitude, this.longitude])
          .addTo(this.lmap)
          .bindPopup(this.defaultPopup)
          .openPopup();
      }
      else {
        this.dmarker = leafletSrc.marker([this.latitude, this.longitude]).addTo(this.lmap);
      }
      this.setDefaultIcon();
    }
  }
  setScale() {
    if (this.showScale) {
      leafletSrc.control.scale().addTo(this.lmap);
    }
  }
  setTileLayer() {
    leafletSrc.tileLayer(this.tileLayer).addTo(this.lmap);
  }
  setView() {
    this.lmap.setView([this.latitude, this.longitude], this.scale);
  }
  updateDefaultMarker() {
    if (this.showDefaultMarker) {
      this.dmarker.setLatLng([this.latitude, this.longitude]);
    }
  }
  updateDefaultPopup() {
    if (this.showDefaultMarker && this.defaultPopup) {
      this.dmarker
        .bindPopup(this.defaultPopup, { offset: leafletSrc.point(0, 6 - this.iconHeight / 2) })
        .openPopup();
    }
  }
  get el() { return getElement(this); }
  static get watchers() { return {
    "defaultPopup": ["defaultPopupHandler"],
    "iconHeight": ["iconHeightHandler"],
    "iconUrl": ["iconUrlHandler"],
    "iconWidth": ["iconWidthHandler"],
    "latitude": ["latitudeHandler"],
    "longitude": ["longitudeHandler"],
    "scale": ["scaleHandler"],
    "userLatitude": ["userLatitudeHandler"],
    "userLongitude": ["userLongitudeHandler"],
    "userIconUrl": ["userIconUrlHandler"],
    "userIconWidth": ["userIconWidthHandler"],
    "userIconHeight": ["userIconHeightHandler"]
  }; }
};
LeafletMarker.style = mapCss;

export { LeafletMarker as noi_mobility_map };
