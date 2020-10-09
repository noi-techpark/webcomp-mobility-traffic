import { r as registerInstance, g as getElement } from './index-eae66176.js';
import { l as leafletSrc } from './leaflet-src-ee2a66f1.js';

/*
* Leaflet.curve v0.6.0 - a plugin for Leaflet mapping library. https://github.com/elfalem/Leaflet.curve
* (c) elfalem 2015-2020
*/
/*
* note that SVG (x, y) corresponds to (long, lat)
*/
L.Curve = L.Path.extend({
  options: {},
  initialize: function (path, options) {
    L.setOptions(this, options);
    this._setPath(path);
  },
  setLatLngs: function (path) {
    return this.setPath(path);
  },
  _updateBounds: function () {
    // Empty function to satisfy L.Path.setStyle() method
  },
  getPath: function () {
    return this._coords;
  },
  setPath: function (path) {
    this._setPath(path);
    return this.redraw();
  },
  getBounds: function () {
    return this._bounds;
  },
  _setPath: function (path) {
    this._coords = path;
    this._bounds = this._computeBounds();
  },
  _computeBounds: function () {
    var bound = new L.LatLngBounds();
    var lastPoint;
    var lastCommand;
    var coord;
    for (var i = 0; i < this._coords.length; i++) {
      coord = this._coords[i];
      if (typeof coord == 'string' || coord instanceof String) {
        lastCommand = coord;
      }
      else if (lastCommand == 'H') {
        bound.extend([lastPoint.lat, coord[0]]);
        lastPoint = new L.latLng(lastPoint.lat, coord[0]);
      }
      else if (lastCommand == 'V') {
        bound.extend([coord[0], lastPoint.lng]);
        lastPoint = new L.latLng(coord[0], lastPoint.lng);
      }
      else if (lastCommand == 'C') {
        var controlPoint1 = new L.latLng(coord[0], coord[1]);
        coord = this._coords[++i];
        var controlPoint2 = new L.latLng(coord[0], coord[1]);
        coord = this._coords[++i];
        var endPoint = new L.latLng(coord[0], coord[1]);
        bound.extend(controlPoint1);
        bound.extend(controlPoint2);
        bound.extend(endPoint);
        endPoint.controlPoint1 = controlPoint1;
        endPoint.controlPoint2 = controlPoint2;
        lastPoint = endPoint;
      }
      else if (lastCommand == 'S') {
        var controlPoint2 = new L.latLng(coord[0], coord[1]);
        coord = this._coords[++i];
        var endPoint = new L.latLng(coord[0], coord[1]);
        var controlPoint1 = lastPoint;
        if (lastPoint.controlPoint2) {
          var diffLat = lastPoint.lat - lastPoint.controlPoint2.lat;
          var diffLng = lastPoint.lng - lastPoint.controlPoint2.lng;
          controlPoint1 = new L.latLng(lastPoint.lat + diffLat, lastPoint.lng + diffLng);
        }
        bound.extend(controlPoint1);
        bound.extend(controlPoint2);
        bound.extend(endPoint);
        endPoint.controlPoint1 = controlPoint1;
        endPoint.controlPoint2 = controlPoint2;
        lastPoint = endPoint;
      }
      else if (lastCommand == 'Q') {
        var controlPoint = new L.latLng(coord[0], coord[1]);
        coord = this._coords[++i];
        var endPoint = new L.latLng(coord[0], coord[1]);
        bound.extend(controlPoint);
        bound.extend(endPoint);
        endPoint.controlPoint = controlPoint;
        lastPoint = endPoint;
      }
      else if (lastCommand == 'T') {
        var endPoint = new L.latLng(coord[0], coord[1]);
        var controlPoint = lastPoint;
        if (lastPoint.controlPoint) {
          var diffLat = lastPoint.lat - lastPoint.controlPoint.lat;
          var diffLng = lastPoint.lng - lastPoint.controlPoint.lng;
          controlPoint = new L.latLng(lastPoint.lat + diffLat, lastPoint.lng + diffLng);
        }
        bound.extend(controlPoint);
        bound.extend(endPoint);
        endPoint.controlPoint = controlPoint;
        lastPoint = endPoint;
      }
      else {
        bound.extend(coord);
        lastPoint = new L.latLng(coord[0], coord[1]);
      }
    }
    return bound;
  },
  getCenter: function () {
    return this._bounds.getCenter();
  },
  _update: function () {
    if (!this._map) {
      return;
    }
    this._updatePath();
  },
  _updatePath: function () {
    if (this._usingCanvas) {
      this._updateCurveCanvas();
    }
    else {
      this._updateCurveSvg();
    }
  },
  _project: function () {
    var coord, lastCoord, curCommand, curPoint;
    this._points = [];
    for (var i = 0; i < this._coords.length; i++) {
      coord = this._coords[i];
      if (typeof coord == 'string' || coord instanceof String) {
        this._points.push(coord);
        curCommand = coord;
      }
      else {
        switch (coord.length) {
          case 2:
            curPoint = this._latLngToPointFn.call(this._map, coord);
            lastCoord = coord;
            break;
          case 1:
            if (curCommand == 'H') {
              curPoint = this._latLngToPointFn.call(this._map, [lastCoord[0], coord[0]]);
              lastCoord = [lastCoord[0], coord[0]];
            }
            else {
              curPoint = this._latLngToPointFn.call(this._map, [coord[0], lastCoord[1]]);
              lastCoord = [coord[0], lastCoord[1]];
            }
            break;
        }
        this._points.push(curPoint);
      }
    }
  },
  _curvePointsToPath: function (points) {
    var point, curCommand, str = '';
    for (var i = 0; i < points.length; i++) {
      point = points[i];
      if (typeof point == 'string' || point instanceof String) {
        curCommand = point;
        str += curCommand;
      }
      else {
        switch (curCommand) {
          case 'H':
            str += point.x + ' ';
            break;
          case 'V':
            str += point.y + ' ';
            break;
          default:
            str += point.x + ',' + point.y + ' ';
            break;
        }
      }
    }
    return str || 'M0 0';
  },
  beforeAdd: function (map) {
    L.Path.prototype.beforeAdd.call(this, map);
    this._usingCanvas = this._renderer instanceof L.Canvas;
    this._latLngToPointFn = this._usingCanvas ? map.latLngToContainerPoint : map.latLngToLayerPoint;
    if (this._usingCanvas) {
      this._pathSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    }
  },
  onAdd: function (map) {
    if (this._usingCanvas) {
      // determine if dash array is set by user
      this._canvasSetDashArray = !this.options.dashArray;
    }
    L.Path.prototype.onAdd.call(this, map); // calls _update()
    if (this._usingCanvas) {
      this._animationCanvasElement = this._insertCustomCanvasElement();
      this._resizeCanvas();
      map.on('resize', this._resizeCanvas, this);
      this._canvasAnimating = false;
    }
    else {
      if (this.options.animate && this._path.animate) {
        var length = this._svgSetDashArray();
        this._path.animate([
          { strokeDashoffset: length },
          { strokeDashoffset: 0 }
        ], this.options.animate);
      }
    }
  },
  onRemove: function (map) {
    L.Path.prototype.onRemove.call(this, map);
    if (this._usingCanvas) {
      this._clearCanvas();
      L.DomUtil.remove(this._animationCanvasElement);
      map.off('resize', this._resizeCanvas, this);
    }
  },
  // SVG specific logic
  _updateCurveSvg: function () {
    this._renderer._setPath(this, this._curvePointsToPath(this._points));
    if (this.options.animate) {
      this._svgSetDashArray();
    }
  },
  _svgSetDashArray: function () {
    var path = this._path;
    var length = path.getTotalLength();
    if (!this.options.dashArray) {
      path.style.strokeDasharray = length + ' ' + length;
    }
    return length;
  },
  // Needed by the `Canvas` renderer for interactivity
  _containsPoint: function (layerPoint) {
    return this._bounds.contains(this._map.layerPointToLatLng(layerPoint));
  },
  // Canvas specific logic below here
  _insertCustomCanvasElement: function () {
    var element = L.DomUtil.create('canvas', 'leaflet-zoom-animated');
    var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    element.style[originProp] = '50% 50%';
    var pane = this._map.getPane(this.options.pane);
    pane.insertBefore(element, pane.firstChild);
    return element;
  },
  _normalizeCanvasAnimationOptions: function () {
    var opts = {
      delay: 0,
      duration: 0,
      iterations: 1
    };
    if (typeof (this.options.animate) == "number") {
      opts.duration = this.options.animate;
    }
    else {
      if (this.options.animate.duration) {
        opts.duration = this.options.animate.duration;
      }
      if (this.options.animate.delay) {
        opts.delay = this.options.animate.delay;
      }
      if (this.options.animate.iterations) {
        opts.iterations = this.options.animate.iterations;
      }
    }
    this.options.animate = opts;
  },
  _updateCurveCanvas: function () {
    this._project();
    var pathString = this._curvePointsToPath(this._points);
    this._pathSvgElement.setAttribute('d', pathString);
    this._path2d = new Path2D(pathString);
    if (this._animationCanvasElement) {
      this._resetCanvas();
    }
  },
  _animationCanvasElement: null,
  _resizeCanvas: function () {
    var size = this._map.getSize();
    this._animationCanvasElement.width = size.x;
    this._animationCanvasElement.height = size.y;
    this._resetCanvas();
  },
  _resetCanvas: function () {
    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._animationCanvasElement, topLeft);
    this._redrawCanvas();
  },
  _redrawCanvas: function () {
    if (!this._canvasAnimating) {
      this._clearCanvas();
      var ctx = this._animationCanvasElement.getContext('2d');
      this._curveFillStroke(this._path2d, ctx);
    }
  },
  _clearCanvas: function () {
    this._animationCanvasElement.getContext('2d').clearRect(0, 0, this._animationCanvasElement.width, this._animationCanvasElement.height);
  },
  _animateCanvas: function (time) {
    var ctx = this._animationCanvasElement.getContext('2d');
    ctx.clearRect(0, 0, this._animationCanvasElement.width, this._animationCanvasElement.height);
    ctx.lineDashOffset = this._tweenedObject.offset;
    this._curveFillStroke(this._path2d, ctx);
    if (this._canvasAnimating) {
      this._animationFrameId = L.Util.requestAnimFrame(this._animateCanvas, this);
    }
  },
  // similar to Canvas._fillStroke(ctx, layer)
  _curveFillStroke: function (path2d, ctx) {
    var options = this.options;
    if (options.fill) {
      ctx.globalAlpha = options.fillOpacity;
      ctx.fillStyle = options.fillColor || options.color;
      ctx.fill(path2d, options.fillRule || 'evenodd');
    }
    if (options.stroke && options.weight !== 0) {
      if (ctx.setLineDash) {
        ctx.setLineDash(this.options && this.options._dashArray || []);
      }
      ctx.globalAlpha = options.opacity;
      ctx.lineWidth = options.weight;
      ctx.strokeStyle = options.color;
      ctx.lineCap = options.lineCap;
      ctx.lineJoin = options.lineJoin;
      ctx.stroke(path2d);
    }
  },
  // path tracing logic below here
  trace: function (t) {
    t = t.filter(function (element) {
      return element >= 0 && element <= 1;
    });
    var point, curCommand, curStartPoint, curEndPoint;
    var p1, p2, p3;
    var samples = [];
    for (var i = 0; i < this._points.length; i++) {
      point = this._points[i];
      if (typeof point == 'string' || point instanceof String) {
        curCommand = point;
        if (curCommand == 'Z') {
          samples = samples.concat(this._linearTrace(t, curEndPoint, curStartPoint));
        }
      }
      else {
        switch (curCommand) {
          case 'M':
            curStartPoint = point;
            curEndPoint = point;
            break;
          case 'L':
          case 'H':
          case 'V':
            samples = samples.concat(this._linearTrace(t, curEndPoint, point));
            curEndPoint = point;
            break;
          case 'C':
            p1 = point;
            p2 = this._points[++i];
            p3 = this._points[++i];
            samples = samples.concat(this._cubicTrace(t, curEndPoint, p1, p2, p3));
            curEndPoint = p3;
            break;
          case 'S':
            p1 = this._reflectPoint(p2, curEndPoint);
            p2 = point;
            p3 = this._points[++i];
            samples = samples.concat(this._cubicTrace(t, curEndPoint, p1, p2, p3));
            curEndPoint = p3;
            break;
          case 'Q':
            p1 = point;
            p2 = this._points[++i];
            samples = samples.concat(this._quadraticTrace(t, curEndPoint, p1, p2));
            curEndPoint = p2;
            break;
          case 'T':
            p1 = this._reflectPoint(p1, curEndPoint);
            p2 = point;
            samples = samples.concat(this._quadraticTrace(t, curEndPoint, p1, p2));
            curEndPoint = p2;
            break;
          default:
            break;
        }
      }
    }
    return samples;
  },
  _linearTrace: function (t, p0, p1) {
    return t.map(interval => {
      var x = this._singleLinearTrace(interval, p0.x, p1.x);
      var y = this._singleLinearTrace(interval, p0.y, p1.y);
      return this._map.layerPointToLatLng([x, y]);
    });
  },
  _quadraticTrace: function (t, p0, p1, p2) {
    return t.map(interval => {
      var x = this._singleQuadraticTrace(interval, p0.x, p1.x, p2.x);
      var y = this._singleQuadraticTrace(interval, p0.y, p1.y, p2.y);
      return this._map.layerPointToLatLng([x, y]);
    });
  },
  _cubicTrace: function (t, p0, p1, p2, p3) {
    return t.map(interval => {
      var x = this._singleCubicTrace(interval, p0.x, p1.x, p2.x, p3.x);
      var y = this._singleCubicTrace(interval, p0.y, p1.y, p2.y, p3.y);
      return this._map.layerPointToLatLng([x, y]);
    });
  },
  _singleLinearTrace: function (t, p0, p1) {
    return p0 + t * (p1 - p0);
  },
  _singleQuadraticTrace: function (t, p0, p1, p2) {
    var oneMinusT = 1 - t;
    return Math.pow(oneMinusT, 2) * p0 +
      2 * oneMinusT * t * p1 +
      Math.pow(t, 2) * p2;
  },
  _singleCubicTrace: function (t, p0, p1, p2, p3) {
    var oneMinusT = 1 - t;
    return Math.pow(oneMinusT, 3) * p0 +
      3 * Math.pow(oneMinusT, 2) * t * p1 +
      3 * oneMinusT * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3;
  },
  _reflectPoint: function (point, over) {
    const x = over.x + (over.x - point.x);
    const y = over.y + (over.y - point.y);
    return L.point(x, y);
  }
});
L.curve = function (path, options) {
  return new L.Curve(path, options);
};

class NoiLeafletCurvePath {
  constructor() {
    this.value = [];
  }
  getValue() {
    return [...this.value];
  }
  moveTo(to) {
    this.value.push('M', to.getValue());
  }
  cubicTo(control1, control2, to) {
    this.value.push('C', control1.getValue(), control2.getValue(), to.getValue());
  }
  lineTo(to) {
    this.value.push('L', to.getValue());
  }
  finish(to) {
    this.value.push('T', to.getValue());
  }
  cubicWithPrevTo(control, to) {
    this.value.push('S', control.getValue(), to.getValue());
  }
}

class NoiPoint {
  constructor(value) {
    this.value = [...value];
  }
  getValue() {
    return this.value;
  }
  get x() {
    return this.value[1];
  }
  get y() {
    return this.value[0];
  }
  plus(factor, ePointF) {
    return new NoiPoint([this.y + factor * ePointF.y, this.x + factor * ePointF.x]);
  }
  plusPoint(ePointF) {
    return this.plus(1, ePointF);
  }
  minus(factor, ePointF) {
    return new NoiPoint([this.y - factor * ePointF.y, this.x - factor * ePointF.x]);
  }
  minusPoint(ePointF) {
    return this.minus(1, ePointF);
  }
  scaleBy(factor) {
    return new NoiPoint([factor * this.y, factor * this.x]);
  }
}
;
function parseKnots(value) {
  return value.map(i => new NoiPoint(i));
}
function getDistance(a, b) {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}
function lengthChunkArray(value, chunkSize) {
  const result = [];
  for (let i = 0; i < value.length; i += chunkSize) {
    result.push(value.slice(i, i + chunkSize));
  }
  return result;
}
function computePathThroughKnots(input, pathRenderer) {
  if (!input || input.length < 2) {
    throw new Error('Path should be at least 2 points long!');
  }
  const distanceChunks = distanceChunkArray(input, 0.4);
  const chunks = distanceChunks.map(chunk => lengthChunkArray(chunk, 5)).reduce((acc, val) => acc.concat(val), []);
  chunks.forEach((chunk, i) => {
    if (!chunk || chunk.length < 2) {
      throw new Error('Chunk should be at least 2 points long!');
    }
    const knots = parseKnots(chunk);
    const firstKnot = knots[0];
    if (i === 0) {
      pathRenderer.moveTo(firstKnot);
    }
    else {
      pathRenderer.lineTo(firstKnot);
    }
    // variable representing the number of Bezier curves we will join together
    const n = knots.length - 1;
    if (n === 1) {
      const lastKnot = knots[1];
      pathRenderer.lineTo(lastKnot);
    }
    else {
      const controlPoints = computeControlPoints(n, knots);
      for (let i = 0; i < n; i++) {
        const targetKnot = knots[i + 1];
        pathRenderer.cubicTo(controlPoints[i], controlPoints[n + i], targetKnot);
      }
    }
  });
}
function distanceChunkArray(value, precision = 0.3) {
  const distanceChunks = value.reduce((result, i) => {
    if (!result.prev && !result.chunks.length) {
      result.prev = i;
      result.chunks.push([i]);
      result.distance = 0;
      return result;
    }
    const distance = getDistance(i, result.prev);
    if (!result.distance) {
      result.prev = i;
      result.chunks[result.chunks.length - 1].push(i);
      result.distance = distance;
      return result;
    }
    const diff = Math.abs(result.distance - distance);
    if (diff > result.distance * precision) {
      const newChunk = [[...result.prev], i];
      result.chunks.push(newChunk);
      result.prev = i;
      result.distance = distance;
      return result;
    }
    result.prev = i;
    result.chunks[result.chunks.length - 1].push(i);
    return result;
  }, { chunks: [], prev: null, distance: 0 }).chunks;
  return distanceChunks;
}
function computeControlPoints(n, knots) {
  const result = new Array(2 * n);
  const target = constructTargetVector(n, knots);
  const lowerDiag = constructLowerDiagonalVector(n - 1);
  const mainDiag = constructMainDiagonalVector(n);
  const upperDiag = constructUpperDiagonalVector(n - 1);
  const newTarget = new Array(n);
  const newUpperDiag = new Array(n - 1);
  // forward sweep for control points c_i,0:
  newUpperDiag[0] = upperDiag[0] / mainDiag[0];
  newTarget[0] = target[0].scaleBy(1 / mainDiag[0]);
  for (let i = 1; i < n - 1; i++) {
    newUpperDiag[i] = upperDiag[i] / (mainDiag[i] - lowerDiag[i - 1] * newUpperDiag[i - 1]);
  }
  for (let i = 1; i < n; i++) {
    const targetScale = 1 / (mainDiag[i] - lowerDiag[i - 1] * newUpperDiag[i - 1]);
    newTarget[i] = target[i].minusPoint(newTarget[i - 1].scaleBy(lowerDiag[i - 1])).scaleBy(targetScale);
  }
  // backward sweep for control points c_i,0:
  result[n - 1] = newTarget[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    result[i] = newTarget[i].minus(newUpperDiag[i], result[i + 1]);
  }
  // calculate remaining control points c_i,1 directly:
  for (let i = 0; i < n - 1; i++) {
    result[n + i] = knots[i + 1].scaleBy(2).minusPoint(result[i + 1]);
  }
  result[2 * n - 1] = knots[n].plusPoint(result[n - 1]).scaleBy(0.5);
  return result;
}
function constructTargetVector(n, knots) {
  const result = new Array(n);
  result[0] = knots[0].plus(2, knots[1]);
  for (let i = 1; i < n - 1; i++) {
    result[i] = (knots[i].scaleBy(2).plusPoint(knots[i + 1])).scaleBy(2);
  }
  result[result.length - 1] = knots[n - 1].scaleBy(8).plusPoint(knots[n]);
  return result;
}
function constructLowerDiagonalVector(length) {
  const result = new Array(length);
  result.fill(1);
  result[result.length - 1] = 2;
  return result;
}
function constructMainDiagonalVector(n) {
  const result = new Array(n);
  result.fill(4);
  result[0] = 2;
  result[result.length - 1] = 7;
  return result;
}
function constructUpperDiagonalVector(length) {
  const result = new Array(length);
  result.fill(1);
  return result;
}

const noiMobilityMapCss = "noi-mobility-map{height:100%;width:100%;overflow:hidden}.leaflet-tile-pane{-webkit-filter:grayscale(100%);filter:grayscale(100%)}.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow{-webkit-user-select:none;-moz-user-select:none;user-select:none;-webkit-user-drag:none}.leaflet-tile::selection{background:transparent}.leaflet-safari .leaflet-tile{image-rendering:-webkit-optimize-contrast}.leaflet-safari .leaflet-tile-container{width:1600px;height:1600px;-webkit-transform-origin:0 0}.leaflet-marker-icon,.leaflet-marker-shadow{display:block}.leaflet-container .leaflet-overlay-pane svg,.leaflet-container .leaflet-marker-pane img,.leaflet-container .leaflet-shadow-pane img,.leaflet-container .leaflet-tile-pane img,.leaflet-container img.leaflet-image-layer,.leaflet-container .leaflet-tile{max-width:none !important;max-height:none !important}.leaflet-container.leaflet-touch-zoom{-ms-touch-action:pan-x pan-y;touch-action:pan-x pan-y}.leaflet-container.leaflet-touch-drag{-ms-touch-action:pinch-zoom;touch-action:none;touch-action:pinch-zoom}.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom{-ms-touch-action:none;touch-action:none}.leaflet-container{-webkit-tap-highlight-color:transparent}.leaflet-container a{-webkit-tap-highlight-color:rgba(51, 181, 229, 0.4)}.leaflet-tile{filter:inherit;visibility:hidden}.leaflet-tile-loaded{visibility:inherit}.leaflet-zoom-box{width:0;height:0;-moz-box-sizing:border-box;box-sizing:border-box;z-index:800}.leaflet-overlay-pane svg{-moz-user-select:none}.leaflet-pane{z-index:400}.leaflet-tile-pane{z-index:200}.leaflet-overlay-pane{z-index:400}.leaflet-shadow-pane{z-index:500}.leaflet-marker-pane{z-index:600}.leaflet-tooltip-pane{z-index:650}.leaflet-popup-pane{z-index:700}.leaflet-map-pane canvas{z-index:100}.leaflet-map-pane svg{z-index:200}.leaflet-vml-shape{width:1px;height:1px}.lvml{behavior:url(#default#VML);display:inline-block;position:absolute}.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto}.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none}.leaflet-top{top:0}.leaflet-right{right:0}.leaflet-bottom{bottom:0}.leaflet-left{left:0}.leaflet-control{float:left;clear:both}.leaflet-right .leaflet-control{float:right}.leaflet-top .leaflet-control{margin-top:10px}.leaflet-bottom .leaflet-control{margin-bottom:10px}.leaflet-left .leaflet-control{margin-left:10px}.leaflet-right .leaflet-control{margin-right:10px}.leaflet-fade-anim .leaflet-tile{will-change:opacity}.leaflet-fade-anim .leaflet-popup{opacity:0;-webkit-transition:opacity 0.2s linear;-moz-transition:opacity 0.2s linear;transition:opacity 0.2s linear}.leaflet-fade-anim .leaflet-map-pane .leaflet-popup{opacity:1}.leaflet-zoom-animated{-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0}.leaflet-zoom-anim .leaflet-zoom-animated{will-change:transform}.leaflet-zoom-anim .leaflet-zoom-animated{-webkit-transition:-webkit-transform 0.25s cubic-bezier(0,0,0.25,1);-moz-transition:-moz-transform 0.25s cubic-bezier(0,0,0.25,1);transition:transform 0.25s cubic-bezier(0,0,0.25,1)}.leaflet-zoom-anim .leaflet-tile,.leaflet-pan-anim .leaflet-tile{-webkit-transition:none;-moz-transition:none;transition:none}.leaflet-zoom-anim .leaflet-zoom-hide{visibility:hidden}.leaflet-interactive{cursor:pointer}.leaflet-grab{cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.leaflet-crosshair,.leaflet-crosshair .leaflet-interactive{cursor:crosshair}.leaflet-popup-pane,.leaflet-control{cursor:auto}.leaflet-dragging .leaflet-grab,.leaflet-dragging .leaflet-grab .leaflet-interactive,.leaflet-dragging .leaflet-marker-draggable{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-image-layer,.leaflet-pane>svg path,.leaflet-tile-container{pointer-events:none}.leaflet-marker-icon.leaflet-interactive,.leaflet-image-layer.leaflet-interactive,.leaflet-pane>svg path.leaflet-interactive,svg.leaflet-image-layer.leaflet-interactive path{pointer-events:visiblePainted;pointer-events:auto}.leaflet-container{background:#ddd;outline:0}.leaflet-container a{color:#0078A8}.leaflet-container a.leaflet-active{outline:2px solid orange}.leaflet-zoom-box{border:2px dotted #38f;background:rgba(255,255,255,0.5)}.leaflet-container{font:12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif}.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,0.65);border-radius:4px}.leaflet-bar a,.leaflet-bar a:hover{background-color:#fff;border-bottom:1px solid #ccc;width:26px;height:26px;line-height:26px;display:block;text-align:center;text-decoration:none;color:black}.leaflet-bar a,.leaflet-control-layers-toggle{background-position:50% 50%;background-repeat:no-repeat;display:block}.leaflet-bar a:hover{background-color:#f4f4f4}.leaflet-bar a:first-child{border-top-left-radius:4px;border-top-right-radius:4px}.leaflet-bar a:last-child{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-bottom:none}.leaflet-bar a.leaflet-disabled{cursor:default;background-color:#f4f4f4;color:#bbb}.leaflet-touch .leaflet-bar a{width:30px;height:30px;line-height:30px}.leaflet-touch .leaflet-bar a:first-child{border-top-left-radius:2px;border-top-right-radius:2px}.leaflet-touch .leaflet-bar a:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px}.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px 'Lucida Console', Monaco, monospace;text-indent:1px}.leaflet-touch .leaflet-control-zoom-in,.leaflet-touch .leaflet-control-zoom-out{font-size:22px}.leaflet-control-layers{box-shadow:0 1px 5px rgba(0,0,0,0.4);background:#fff;border-radius:5px}.leaflet-control-layers-toggle{background-image:url(images/layers.png);width:36px;height:36px}.leaflet-retina .leaflet-control-layers-toggle{background-image:url(images/layers-2x.png);background-size:26px 26px}.leaflet-touch .leaflet-control-layers-toggle{width:44px;height:44px}.leaflet-control-layers .leaflet-control-layers-list,.leaflet-control-layers-expanded .leaflet-control-layers-toggle{display:none}.leaflet-control-layers-expanded .leaflet-control-layers-list{display:block;position:relative}.leaflet-control-layers-expanded{padding:6px 10px 6px 6px;color:#333;background:#fff}.leaflet-control-layers-scrollbar{overflow-y:scroll;overflow-x:hidden;padding-right:5px}.leaflet-control-layers-selector{margin-top:2px;position:relative;top:1px}.leaflet-control-layers label{display:block}.leaflet-control-layers-separator{height:0;border-top:1px solid #ddd;margin:5px -10px 5px -6px}.leaflet-default-icon-path{background-image:url(images/marker-icon.png)}.leaflet-container .leaflet-control-attribution{background:#fff;background:rgba(255, 255, 255, 0.7);margin:0}.leaflet-control-attribution,.leaflet-control-scale-line{padding:0 5px;color:#333}.leaflet-control-attribution a{text-decoration:none}.leaflet-control-attribution a:hover{text-decoration:underline}.leaflet-container .leaflet-control-attribution,.leaflet-container .leaflet-control-scale{font-size:11px}.leaflet-left .leaflet-control-scale{margin-left:5px}.leaflet-bottom .leaflet-control-scale{margin-bottom:5px}.leaflet-control-scale-line{border:2px solid #777;border-top:none;line-height:1.1;padding:2px 5px 1px;font-size:11px;white-space:nowrap;overflow:hidden;-moz-box-sizing:border-box;box-sizing:border-box;background:#fff;background:rgba(255, 255, 255, 0.5)}.leaflet-control-scale-line:not(:first-child){border-top:2px solid #777;border-bottom:none;margin-top:-2px}.leaflet-control-scale-line:not(:first-child):not(:last-child){border-bottom:2px solid #777}.leaflet-touch .leaflet-control-attribution,.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{box-shadow:none}.leaflet-touch .leaflet-control-layers,.leaflet-touch .leaflet-bar{border:2px solid rgba(0,0,0,0.2);background-clip:padding-box}.leaflet-popup{position:absolute;text-align:center;margin-bottom:20px}.leaflet-popup-content-wrapper{padding:1px;text-align:left;border-radius:12px}.leaflet-popup-content{margin:13px 19px;line-height:1.4}.leaflet-popup-content p{margin:18px 0}.leaflet-popup-tip-container{width:40px;height:20px;position:absolute;left:50%;margin-left:-20px;overflow:hidden;pointer-events:none}.leaflet-popup-tip{width:17px;height:17px;padding:1px;margin:-10px auto 0;-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.leaflet-popup-content-wrapper,.leaflet-popup-tip{background:white;color:#333;box-shadow:0 3px 14px rgba(0,0,0,0.4)}.leaflet-container a.leaflet-popup-close-button{position:absolute;top:0;right:0;padding:4px 4px 0 0;border:none;text-align:center;width:18px;height:14px;font:16px/14px Tahoma, Verdana, sans-serif;color:#c3c3c3;text-decoration:none;font-weight:bold;background:transparent}.leaflet-container a.leaflet-popup-close-button:hover{color:#999}.leaflet-popup-scrolled{overflow:auto;border-bottom:1px solid #ddd;border-top:1px solid #ddd}.leaflet-oldie .leaflet-popup-content-wrapper{-ms-zoom:1}.leaflet-oldie .leaflet-popup-tip{width:24px;margin:0 auto;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";filter:progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)}.leaflet-oldie .leaflet-popup-tip-container{margin-top:-1px}.leaflet-oldie .leaflet-control-zoom,.leaflet-oldie .leaflet-control-layers,.leaflet-oldie .leaflet-popup-content-wrapper,.leaflet-oldie .leaflet-popup-tip{border:1px solid #999}.leaflet-div-icon{background:#fff;border:1px solid #666}.leaflet-tooltip{position:absolute;padding:6px;background-color:#fff;border:1px solid #fff;border-radius:3px;color:#222;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;box-shadow:0 1px 3px rgba(0,0,0,0.4)}.leaflet-tooltip.leaflet-clickable{cursor:pointer;pointer-events:auto}.leaflet-tooltip-top:before,.leaflet-tooltip-bottom:before,.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{position:absolute;pointer-events:none;border:6px solid transparent;background:transparent;content:\"\"}.leaflet-tooltip-bottom{margin-top:6px}.leaflet-tooltip-top{margin-top:-6px}.leaflet-tooltip-bottom:before,.leaflet-tooltip-top:before{left:50%;margin-left:-6px}.leaflet-tooltip-top:before{bottom:0;margin-bottom:-12px;border-top-color:#fff}.leaflet-tooltip-bottom:before{top:0;margin-top:-12px;margin-left:-6px;border-bottom-color:#fff}.leaflet-tooltip-left{margin-left:-6px}.leaflet-tooltip-right{margin-left:6px}.leaflet-tooltip-left:before,.leaflet-tooltip-right:before{top:50%;margin-top:-6px}.leaflet-tooltip-left:before{right:0;margin-right:-12px;border-left-color:#fff}.leaflet-tooltip-right:before{left:0;margin-left:-12px;border-right-color:#fff}";

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
  renderCircle(e) {
    if (e.nodeName !== 'LEAFLET-CIRCLE') {
      return;
    }
    const opts = {
      radius: e.getAttribute('radius'),
      stroke: e.hasAttribute('stroke'),
      color: e.hasAttribute('color') ? e.getAttribute('color') : '#5b879f',
      weight: e.hasAttribute('weight') ? e.getAttribute('weight') : 3,
      opacity: e.hasAttribute('opacity') ? e.getAttribute('opacity') : 1.0,
      lineCap: e.hasAttribute('line-cap') ? e.getAttribute('line-cap') : 'round',
      lineJoin: e.hasAttribute('line-join') ? e.getAttribute('line-join') : 'round',
      dashArray: e.hasAttribute('dash-array') ? e.getAttribute('dash-array') : null,
      dashOffset: e.hasAttribute('dash-offset') ? e.getAttribute('dash-offset') : null,
      fill: e.hasAttribute('fill') && e.getAttribute('fill') === 'false' ? false : true,
      fillColor: e.hasAttribute('fill-color') ? e.getAttribute('fill-color') : '#88b2ca',
      fillOpacity: e.hasAttribute('fill-opacity') ? e.getAttribute('fill-opacity') : 0.8,
      fillRule: e.hasAttribute('fill-rule') ? e.getAttribute('fill-rule') : 'nonzero',
      bubblingMouseEvents: e.hasAttribute('bubbling-mouse-events'),
    };
    const circle = leafletSrc.circle([e.getAttribute('latitude'), e.getAttribute('longitude')], opts);
    this.children.set(e, circle);
    circle.addTo(this.lmap);
    if (e.textContent) {
      circle.bindPopup(e.textContent).openPopup();
    }
  }
  renderPolyline(e) {
    if (e.nodeName !== 'LEAFLET-POLYLINE') {
      return;
    }
    const opts = {
      fill: false,
      color: e.hasAttribute('color') ? e.getAttribute('color') : '#5b879f',
      weight: e.hasAttribute('weight') ? e.getAttribute('weight') : 3,
      opacity: e.hasAttribute('opacity') ? e.getAttribute('opacity') : 1.0,
      lineCap: e.hasAttribute('line-cap') ? e.getAttribute('line-cap') : 'round',
      lineJoin: e.hasAttribute('line-join') ? e.getAttribute('line-join') : 'round',
      dashArray: e.hasAttribute('dash-array') ? e.getAttribute('dash-array') : null,
      dashOffset: e.hasAttribute('dash-offset') ? e.getAttribute('dash-offset') : null,
      bubblingMouseEvents: e.hasAttribute('bubbling-mouse-events'),
      className: e.hasAttribute('class-name'),
    };
    const path = JSON.parse(e.getAttribute('path'));
    const pathRenderer = new NoiLeafletCurvePath();
    computePathThroughKnots(path, pathRenderer);
    const curveData = pathRenderer.getValue();
    const line = leafletSrc.curve(curveData, opts);
    this.children.set(e, line);
    line.addTo(this.lmap);
    // const fitMap = e.hasAttribute('fit-map') && e.getAttribute('fit-map') === 'false' ? false : true;
    // if (fitMap) {
    //   this.lmap.fitBounds(line.getBounds());
    // }
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
        case 'LEAFLET-CIRCLE':
          this.renderCircle(e);
          break;
        case 'LEAFLET-CIRCLE':
          this.renderCircle(e);
        case 'LEAFLET-POLYLINE':
          this.renderPolyline(e);
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
LeafletMarker.style = noiMobilityMapCss;

export { LeafletMarker as noi_mobility_map };
