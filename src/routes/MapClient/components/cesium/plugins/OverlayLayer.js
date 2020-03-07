

var Layers = require('../../../../../utils/cesium/Layers');
var Cesium = require('../cesium');
const { isEqual } = require("lodash");
var eventListener = require('eventlistener');
/**
 * Created by thomas on 27/01/14.
 */

const InfoWindow = (function() {
    function _(cesiumWidget) {

        this._scene = cesiumWidget.scene;
        let div = document.createElement('div');
        div.className = 'infoWindow mapboxgl-popup mapboxgl-popup-anchor-bottom ';
        this._div = div;
      
        let content = document.createElement('div');
        content.className = 'mapboxgl-popup-content';
        this._div.appendChild(content);
        let tip = document.createElement('div');
        tip.className = 'mapboxgl-popup-tip';
        tip.style.margin="auto";
        this._div.appendChild(tip);
        
        cesiumWidget.container.appendChild(div);
        this._content = content;
        this.setVisible(true);
    }

    _.prototype.setVisible = function(visible) {
        this._visible = visible;
        this._div.style.display = visible ? 'block' : 'none';
    };



    _.prototype.setContent = function(content) {
        if (typeof content === 'string') {
            this._content.innerHTML = content;
        } else {
            while (this._content.firstChild) {
                this._content.removeChild(this._content.firstChild);
            }
            this._content.appendChild(content);
        }
    };

    _.prototype.setPosition = function(lat, lng) {
        this._position = this._scene.globe.ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(lng, lat, 0));
    };

    _.prototype.showAt = function(lat, lng, content) {
        this.setPosition(lat, lng);
        this.setContent(content);
        this.setVisible(true);
    };

    _.prototype.hide = function() {
        this.setVisible(false);
    };

    _.prototype.computeVisible = function() {
        // Ellipsoid radii - WGS84 shown here
        var rX = 6378137.0;
        var rY = 6378137.0;
        var rZ = 6356752.3142451793;
        // Vector CV
        var cameraPosition = this._scene.camera.position;
        var cvX = cameraPosition.x / rX;
        var cvY = cameraPosition.y / rY;
        var cvZ = cameraPosition.z / rZ;

        var vhMagnitudeSquared = cvX * cvX + cvY * cvY + cvZ * cvZ - 1.0;

        // Target position, transformed to scaled space

        var position = this._position;
        var tX = position.x / rX;
        var tY = position.y / rY;
        var tZ = position.z / rZ;

        // Vector VT
        var vtX = tX - cvX;
        var vtY = tY - cvY;
        var vtZ = tZ - cvZ;
        var vtMagnitudeSquared = vtX * vtX + vtY * vtY + vtZ * vtZ;

        // VT dot VC is the inverse of VT dot CV
        var vtDotVc = -(vtX * cvX + vtY * cvY + vtZ * cvZ);

        var isOccluded = vtDotVc > vhMagnitudeSquared &&
            vtDotVc * vtDotVc / vtMagnitudeSquared > vhMagnitudeSquared;

        if (isOccluded) {
            this.setVisible(false);
        } else {
            this.setVisible(true);
        }

    };

    _.prototype.update = function() {
        this.computeVisible();

        if (!this._visible || !this._position) {
            return;
        }
        // get the position on the globe as screen coordinates
        // coordinates with origin at the top left corner
        let coordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(this._scene, this._position);
        if (coordinates) {
            let left = Math.floor(coordinates.x) - Math.floor(this._div.clientWidth/2)+ "px";
            let top = Math.floor(coordinates.y) - this._div.clientHeight + "px";
            this._div.tabIndex = 5;
            this._div.style.left = left;
            this._div.style.top = top;
        }
    };

    _.prototype.destroy = function() {
        this._div.parentNode.removeChild(this._div);
    };

    return _;

})();

const removeIds = (items) => {
    if (items.length !== 0) {
        for (let i = 0; i < items.length; i++) {
            let item = items.item(i);
            item.removeAttribute('data-reactid');
            removeIds(item.children || []);
        }
    }
};

const cloneOriginalOverlay = (original, options) => {
    let cloned = original.cloneNode(true);
    cloned.id = options.id + '-overlay';
    cloned.className = (options.className || original.className) + "-overlay";
    cloned.removeAttribute('data-reactid');
    // remove reactjs generated ids from cloned object
    removeIds(cloned.children || []);
    // handle optional close button on overlay
    const closeClassName = options.closeClass || 'close';
    if (options.onClose && cloned.getElementsByClassName(closeClassName).length === 1) {
        const close = cloned.getElementsByClassName(closeClassName)[0];
        const onClose = (e) => {
            options.onClose(e.target.getAttribute('data-overlayid'));
        };
        eventListener.add(close, 'click', onClose);
    }
    return cloned;
};

Layers.registerType('overlay', {
    create: (options, map) => {

        const original = document.getElementById(options.id);
        const cloned = cloneOriginalOverlay(original, options);

        let infoWindow = new InfoWindow(map);
        infoWindow.showAt(options.position.y, options.position.x, cloned);
        options.content&&infoWindow.setContent(options.content)
        infoWindow.setVisible(true);
        let info = map.scene.primitives.add(infoWindow);

        return {
            detached: true,
            info: info,
            infoWindow:infoWindow,
            remove: () => {
                map.scene.primitives.remove(info);
            }
        };
    },
    update: function(layer, newOptions, oldOptions, map) {
        if (!isEqual(newOptions.content, oldOptions.content)) {
          layer.remove();
          return this.create(newOptions, map);
        }
        return null;
      }
});
