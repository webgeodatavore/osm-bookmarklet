(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var SphericalMercator = (function(){

// Closures including constants and other precalculated values.
var cache = {},
    EPSLN = 1.0e-10,
    D2R = Math.PI / 180,
    R2D = 180 / Math.PI,
    // 900913 properties.
    A = 6378137.0,
    MAXEXTENT = 20037508.342789244;


// SphericalMercator constructor: precaches calculations
// for fast tile lookups.
function SphericalMercator(options) {
    options = options || {};
    this.size = options.size || 256;
    if (!cache[this.size]) {
        var size = this.size;
        var c = cache[this.size] = {};
        c.Bc = [];
        c.Cc = [];
        c.zc = [];
        c.Ac = [];
        for (var d = 0; d < 30; d++) {
            c.Bc.push(size / 360);
            c.Cc.push(size / (2 * Math.PI));
            c.zc.push(size / 2);
            c.Ac.push(size);
            size *= 2;
        }
    }
    this.Bc = cache[this.size].Bc;
    this.Cc = cache[this.size].Cc;
    this.zc = cache[this.size].zc;
    this.Ac = cache[this.size].Ac;
};

// Convert lon lat to screen pixel value
//
// - `ll` {Array} `[lon, lat]` array of geographic coordinates.
// - `zoom` {Number} zoom level.
SphericalMercator.prototype.px = function(ll, zoom) {
    var d = this.zc[zoom];
    var f = Math.min(Math.max(Math.sin(D2R * ll[1]), -0.9999), 0.9999);
    var x = Math.round(d + ll[0] * this.Bc[zoom]);
    var y = Math.round(d + 0.5 * Math.log((1 + f) / (1 - f)) * (-this.Cc[zoom]));
    (x > this.Ac[zoom]) && (x = this.Ac[zoom]);
    (y > this.Ac[zoom]) && (y = this.Ac[zoom]);
    //(x < 0) && (x = 0);
    //(y < 0) && (y = 0);
    return [x, y];
};

// Convert screen pixel value to lon lat
//
// - `px` {Array} `[x, y]` array of geographic coordinates.
// - `zoom` {Number} zoom level.
SphericalMercator.prototype.ll = function(px, zoom) {
    var g = (px[1] - this.zc[zoom]) / (-this.Cc[zoom]);
    var lon = (px[0] - this.zc[zoom]) / this.Bc[zoom];
    var lat = R2D * (2 * Math.atan(Math.exp(g)) - 0.5 * Math.PI);
    return [lon, lat];
};

// Convert tile xyz value to bbox of the form `[w, s, e, n]`
//
// - `x` {Number} x (longitude) number.
// - `y` {Number} y (latitude) number.
// - `zoom` {Number} zoom.
// - `tms_style` {Boolean} whether to compute using tms-style.
// - `srs` {String} projection for resulting bbox (WGS84|900913).
// - `return` {Array} bbox array of values in form `[w, s, e, n]`.
SphericalMercator.prototype.bbox = function(x, y, zoom, tms_style, srs) {
    // Convert xyz into bbox with srs WGS84
    if (tms_style) {
        y = (Math.pow(2, zoom) - 1) - y;
    }
    // Use +y to make sure it's a number to avoid inadvertent concatenation.
    var ll = [x * this.size, (+y + 1) * this.size]; // lower left
    // Use +x to make sure it's a number to avoid inadvertent concatenation.
    var ur = [(+x + 1) * this.size, y * this.size]; // upper right
    var bbox = this.ll(ll, zoom).concat(this.ll(ur, zoom));

    // If web mercator requested reproject to 900913.
    if (srs === '900913') {
        return this.convert(bbox, '900913');
    } else {
        return bbox;
    }
};

// Convert bbox to xyx bounds
//
// - `bbox` {Number} bbox in the form `[w, s, e, n]`.
// - `zoom` {Number} zoom.
// - `tms_style` {Boolean} whether to compute using tms-style.
// - `srs` {String} projection of input bbox (WGS84|900913).
// - `@return` {Object} XYZ bounds containing minX, maxX, minY, maxY properties.
SphericalMercator.prototype.xyz = function(bbox, zoom, tms_style, srs) {
    // If web mercator provided reproject to WGS84.
    if (srs === '900913') {
        bbox = this.convert(bbox, 'WGS84');
    }

    var ll = [bbox[0], bbox[1]]; // lower left
    var ur = [bbox[2], bbox[3]]; // upper right
    var px_ll = this.px(ll, zoom);
    var px_ur = this.px(ur, zoom);
    // Y = 0 for XYZ is the top hence minY uses px_ur[1].
    var bounds = {
        minX: Math.floor(px_ll[0] / this.size),
        minY: Math.floor(px_ur[1] / this.size),
        maxX: Math.floor((px_ur[0] - 1) / this.size),
        maxY: Math.floor((px_ll[1] - 1) / this.size)
    };
    if (tms_style) {
        var tms = {
            minY: (Math.pow(2, zoom) - 1) - bounds.maxY,
            maxY: (Math.pow(2, zoom) - 1) - bounds.minY
        };
        bounds.minY = tms.minY;
        bounds.maxY = tms.maxY;
    }
    return bounds;
};

// Convert projection of given bbox.
//
// - `bbox` {Number} bbox in the form `[w, s, e, n]`.
// - `to` {String} projection of output bbox (WGS84|900913). Input bbox
//   assumed to be the "other" projection.
// - `@return` {Object} bbox with reprojected coordinates.
SphericalMercator.prototype.convert = function(bbox, to) {
    if (to === '900913') {
        return this.forward(bbox.slice(0, 2)).concat(this.forward(bbox.slice(2,4)));
    } else {
        return this.inverse(bbox.slice(0, 2)).concat(this.inverse(bbox.slice(2,4)));
    }
};

// Convert lon/lat values to 900913 x/y.
SphericalMercator.prototype.forward = function(ll) {
    var xy = [
        A * ll[0] * D2R,
        A * Math.log(Math.tan((Math.PI*0.25) + (0.5 * ll[1] * D2R)))
    ];
    // if xy value is beyond maxextent (e.g. poles), return maxextent.
    (xy[0] > MAXEXTENT) && (xy[0] = MAXEXTENT);
    (xy[0] < -MAXEXTENT) && (xy[0] = -MAXEXTENT);
    (xy[1] > MAXEXTENT) && (xy[1] = MAXEXTENT);
    (xy[1] < -MAXEXTENT) && (xy[1] = -MAXEXTENT);
    return xy;
};

// Convert 900913 x/y values to lon/lat.
SphericalMercator.prototype.inverse = function(xy) {
    return [
        (xy[0] * R2D / A),
        ((Math.PI*0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D
    ];
};

return SphericalMercator;

})();

if (typeof module !== 'undefined' && typeof exports !== 'undefined') {
    module.exports = exports = SphericalMercator;
}

},{}],2:[function(require,module,exports){
var links = {
  'link': {
    'title': 'Link to other web maps',
    'list': [
    {
      'label': 'Openstreetmap.org',
      'url': 'http://www.openstreetmap.org/',
      'urlType': 'hash',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Historique (osm.org)',
      'url': 'http://www.openstreetmap.org/browse/changesets',
      'urlType': 'hash',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Flickr',
      'url': 'https://www.flickr.com/map/',
      'urlType': 'flickr',
      'category': 'Photo'
    },
    {
      'label': 'Panoramio',
      'url': 'http://www.panoramio.com/map/',
      'urlType': 'panoramio',
      'category': 'Photo'
    },
    {
      'label': 'Google Maps',
      'url': 'https://www.google.com/maps/',
      'urlType': 'googlemaps',
      'category': 'Others'
    },
    {
      'label': 'FlashEarth',
      'url': 'http://www.flashearth.com/',
      'urlType': 'default_z',
      'category': 'Others'
    },
    {
      'label': 'Geocaching',
      'url': 'http://www.geocaching.com/map/default.aspx',
      'urlType': 'gc',
      'category': 'Games'
    },
    // {
    //   'label': 'Opencaching',
    //   'url': 'http://www.opencaching.com/fr/#find',
    //   'urlType': 'bbox',
    //   'category': 'Games'
    // },
    {
      'label': 'Confluence',
      'url': 'http://www.confluence.org/confluence.php',
      'urlType': 'default',
      'category': 'Games'
    },
    {
      'label': 'Waymarking',
      'url': 'http://www.waymarking.com/wm/search.aspx',
      'urlType': 'default',
      'category': 'Games'
    },
    {
      'label': 'OpenGeoFiction',
      'url': 'http://www.opengeofiction.net/',
      'urlType': 'hash',
      'category': 'Games'
    },
    {
      'label': 'VTTrack',
      'url': 'http://www.vttrack.fr/',
      'urlType': 'default',
      'category': 'Outdoor'
    },
    {
      'label': 'Wikiloc',
      'url': 'http://fr.wikiloc.com/wikiloc/map.do',
      'urlType': 'wikiloc',
      'category': 'Outdoor'
    },
    {
      'label': 'Refuges.info',
      'url': 'http://maps.refuges.info/',
      'urlType': 'default',
      'category': 'Outdoor'
    },
    {
      'label': 'Waymarkedtrails',
      'url': 'http://hiking.waymarkedtrails.org/fr/',
      'urlType': 'default',
      'category': 'Outdoor'
    },
    {
      'label': 'OpenTopoMap',
      'url': 'http://opentopomap.org/',
      'urlType': 'hash',
      'category': 'Outdoor'
    },
    {
      'label': 'Meteox Rain Radar',
      'url': 'http://meteox.fr/meteox-maps.aspx',
      'urlType': 'default_z',
      'maxZoom': '10',
      'params': 'a=1',
      'category': 'Others'
    },
    {
      'label': 'OSMInterest',
      'url': 'http://178.32.101.237/osminterest/',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'OpenLinkMap',
      'url': 'http://www.openlinkmap.org/',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'OpenFireMap',
      'url': 'http://openfiremap.org/',
      'urlType': 'default',
      'category': 'Others'
    },
    {
      'label': 'Open Signal',
      'url': 'http://opensignal.com/index.php',
      'urlType': 'open_signal',
      'category': 'Others'
    },
    {
      'label': 'Map of last changes',
      'url': 'http://matt.dev.openstreetmap.org/owl_viewer/weeklymap',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'OpenRouteService',
      'url': 'http://openrouteservice.org/',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Openstreetbrowser',
      'url': 'http://www.openstreetbrowser.org/',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'OpenSnowMap',
      'url': 'http://www.opensnowmap.org/',
      'urlType': 'default',
      'category': 'Outdoor-Ski'
    },
    {
      'label': 'OpenPisteMap',
      'url': 'http://openpistemap.org/',
      'urlType': 'default',
      'category': 'Outdoor-Ski'
    },
    {
      'label': 'Pistes nordiques',
      'url': 'http://www.pistes-nordiques.org/',
      'urlType': 'default',
      'category': 'Outdoor-Ski'
    },
    {
      'label': 'SkiTrack',
      'url': 'http://www.skitrack.fr/',
      'urlType': 'default',
      'category': 'Outdoor-Ski'
    },
    {
      'label': 'Camp2camp',
      'url': 'http://www.camptocamp.org/map',
      'urlType': 'c2c',
      'category': 'Outdoor'
    },
    // {
    //   'label': 'OpenOrienteeringMap',
    //   'url': 'http://oobrien.com/oom/global.php',
    //   'urlType': 'default',
    //   'category': 'Outdoor'
    // },
    {
      'label': 'HikeBikeMap',
      'url': 'http://www.hikebikemap.de/',
      'urlType': 'default',
      'category': 'Outdoor'
    },
    {
      'label': 'geojson.io',
      'url': 'http://geojson.io/',
      'urlType': 'hash',
      'category': 'Tools'
    },
    {
      'label': 'XAPI viewer',
      'url': 'http://osm.dumoulin63.net/xapiviewer/',
      'urlType': 'default',
      'category': 'Tools'
    },
    {
      'label': 'Overpass-turbo',
      'url': 'http://overpass-turbo.eu/',
      'urlType': 'default',
      'category': 'Tools'
    },
    {
      'label': 'Map Compare',
      'url': 'http://mc.bbbike.org/mc/',
      'urlType': 'default',
      'category': 'Tools'
    },
    {
      'label': 'OSM GPS Points',
      'url': 'http://resultmaps.neis-one.org/osmgps.html',
      'urlType': 'default',
      'maxZoom': '8',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Your OSM heat map',
      'url': 'http://yosmhm.neis-one.org/',
      'urlType': 'input_user',
      'maxZoom': '13',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Who\'s around me',
      'url': 'http://resultmaps.neis-one.org/oooc',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Newest OSM Contrib.',
      'url': 'http://resultmaps.neis-one.org/newestosm.php',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'New contributors feed',
      'url': 'http://resultmaps.neis-one.org/newestosmcreatefeed',
      'urlType': 'default',
      'category': 'OpenStreetMap'
    },
    {
      'label': 'Wikimapia',
      'url': 'http://wikimapia.org/',
      'urlType': 'wikimapia',
      'params': '&lang=fr&m=b',
      'category': 'Others'
    },
    {
      'label': 'Geody',
      'url': 'http://www.geody.com/geolook.php',
      'urlType': 'default',
      'category': 'Others'
    },
    {
      'label': 'Geody KML',
      'url': 'http://www.geody.com/geovex.php',
      'urlType': 'default',
      'params': '&fmt=gearth',
      'category': 'Others'
    },
    {
      'label': 'OpenWeatherMap',
      'url': 'http://openweathermap.org/maps',
      'urlType': 'default',
      'params': '&layers=B0FTTFFT',
      'category': 'Others'
    },
    {
      'label': 'Flightradar24',
      'url': 'http://www.flightradar24.com/',
      'urlType': 'hash2',
      'category': 'Transport'
    },
    {
      'label': 'Ship watch',
      'url': 'http://www.geody.com/shipswatch.php',
      'urlType': 'default',
      'category': 'Transport'
    },
    {
      'label': 'OSM Tchoutchou',
      'url': 'http://raildar.fr/',
      'urlType': 'gc_zoom',
      'category': 'Transport'
    },
    {
      'label': 'Heaven Above',
      'url': 'http://www.heavens-above.com/allsats.aspx',
      'urlType': 'gc',
      'category': 'Others'
    }
  ]},
  'edit': {
    'title': 'Openstreetmap editing',
    'list': [
    {
      'label': 'Edit with Id',
      'url': 'http://www.openstreetmap.org/edit?editor=id',
      'urlType': 'hash'
    },
    {
      'label': 'Edit with Potlatch',
      'url': 'http://www.openstreetmap.org/edit?editor=potlatch2',
      'urlType': 'hash'
    },
    // {
    //   'label': 'Load in JOSM',
    //   'url': 'http://127.0.0.1:8111/load_and_zoom',
    //   'urlType': 'josm'
    // },
    {
      'label': 'Amenity editor',
      'url': 'http://ae.osmsurround.org/ae/index',
      'urlType': 'default'
    }
  ]},
  'check': {
    'title': 'Openstreetmap control',
    'list': [
    {
      'label': 'Osmose',
      'url': 'http://osmose.openstreetmap.fr/map/cgi-bin/index.py',
      'urlType': 'default'
    },
    {
      'label': 'OSMInspector',
      'url': 'http://tools.geofabrik.de/osmi/',
      'urlType': 'default'
    },
    {
      'label': 'Keepright',
      'url': 'http://keepright.ipax.at/report_map.php',
      'urlType': 'default'
    },
    {
      'label': 'WhoDitIt',
      'url': 'http://zverik.osm.rambler.ru/whodidit/',
      'urlType': 'default'
    },
    {
      'label': 'OpenstreetBugs',
      'url': 'http://openstreetbugs.appspot.com/',
      'urlType': 'default'
    }
  ]}
};

exports.links = links;
},{}],3:[function(require,module,exports){
var z_m_couples = [
  {z: '20', m: '46'},
  {z: '19', m: '91'},
  {z: '18', m: '183'},
  {z: '17', m: '365'},
  {z: '16', m: '731'},
  {z: '15', m: '1462'},
  {z: '14', m: '2924'},
  {z: '13', m: '5848'},
  {z: '12', m: '11696'},
  {z: '11', m: '23392'},
  {z: '10', m: '46784'},
  {z: '9', m: '93567'},
  {z: '8', m: '187135'},
  {z: '7', m: '374269'},
  {z: '6', m: '748539'},
  {z: '5', m: '1497077'},
  {z: '4', m: '2994155'},
  {z: '3', m: '5988310'}
];

/**
* Consume both z and m parameters in order to be able to switch
* between URL with map vectorized background and imagery.
*
* @param {Object} val value you use to get the z or m value
* @param {boolean=} reverse change the default order from z to m to m to z
* @return {String} Return a z or a m value matching the other
*/
function convert_z_m(val, reverse) {
  var order = 'zm';
  if (reverse != undefined && reverse === true) {
    order = order.split('').reverse().join('');
  }
  var filtered = z_m_couples.filter(function(el) {
    // console.log(order.charAt(0), el[order.charAt(0)], val);
    if (el[order.charAt(0)] == val) {
      return el;
    }
  });
  if (filtered.length == 1) {
    return filtered[0][order.charAt(1)];
  }
}
exports.convert_z_m = convert_z_m;

/**
* Consume a Google Maps url to get the X, Y (latitude, longitude)
* and the Z (the tile level for Spherical Mercator tiling scheme).
*
* @param {String} url the value should come from the window.location.href value
* @return {Array} Return an array of x, y, z
*/
function parseXYZFromUrl(url) {
  var PARSE_COORDINATES_REGEX = /@(.*[\/]{0,1})/g;
  var xyz = url.match(PARSE_COORDINATES_REGEX);
  if (xyz.length > 0) {
    xyz = xyz[0].split('/')[0].split('?')[0].replace('@', '').split(',');
  } else {
    console.log('Error, are you really on Google Maps');
  }
  var x = xyz[1];
  var y = xyz[0];
  var z;
  if (xyz[2].endsWith('z')) {
    // z = convert_z_m(xyz[2].replace('z', ''));
    z = xyz[2].replace('z', '');
  } else {
    if (xyz[2].endsWith('m')) {
      z = convert_z_m(xyz[2].replace('m', ''));
    } else {
      console.log('You have an error');
    }
  }
  return [x, y, z];
}
exports.parseXYZFromUrl = parseXYZFromUrl;

},{}],4:[function(require,module,exports){
exports.createleftSideBar = createleftSideBar;
exports.readLinks = readLinks;

lnk = require('./links.js');

function createleftSideBar(url) {
  var block = '<div id="osmbookmarklet">';
  block += '<div id="osmshortcuts" style="display:none;">';
  block += [
    {id: 'edit', title: 'Openstreetmap editing'},
    {id: 'check', title: 'Openstreetmap control'},
    {id: 'link', title: 'Link to other web maps'}
  ].map(function(el) {
    return '<div id="' + el.id + '">' +
           '<h2>' + el.title + '</h2>' +
           '</div>';
  }).join('');
  block += '</div>';
  block += '<div id="osmbutton">';
  block += '<a href="#">';
  block += '<img src="' + url + '">';
  block += '</a>';
  block += '</div>';
  block += '</div>';
  var div = document.createElement('div');
  div.innerHTML = block;
  div.querySelector('#osmbutton a').onclick = function(e) {
    var osmshortcuts = document.getElementById('osmshortcuts');
    if (osmshortcuts.style.display == 'none') {
      osmshortcuts.style.display = 'initial';
    } else {
      osmshortcuts.style.display = 'None';
    }
  };
  return div.firstChild;
}

// Create div for logo

function appendList(parentDom, subtree) {
  subtree.forEach(function(el) {
    var li = document.createElement('li');
    li.className = 'lilevel1';
    var link = document.createElement('a');
    link.href = '#';
    link.onclick = function() {
      lnk.buildLink(el.url, el.urlType, el.maxZoom, el.params);
    };
    var text = document.createTextNode(el.label);
    link.appendChild(text);
    li.appendChild(link);
    parentDom.appendChild(li);
  });
}

/*
 * Fill links menu
 */
function readLinks(links) {
  var ulLinks = document.getElementById('link');
  var ulEdit = document.getElementById('edit');
  var ulChecks = document.getElementById('check');

    // Create a li element for each link category
    // containing an empty ul for links li
    var categories = [];
    links.link.list.forEach(function(el) {
      category = el.category;
      if (categories.indexOf(category) === -1) {
        categories.push(category);

        var ul = document.createElement('ul');
        ul.id = 'category-' + category;
        ul.className = 'optgroup';

        var label = document.createElement('p');
        label.className = 'categoryClass';
        var label_content = document.createTextNode(category);
        label.appendChild(label_content);
        ul.appendChild(label);

        var li = document.createElement('li');
        li.className = 'optgroup';
        li.appendChild(ul);

        ulLinks.appendChild(li);
      }
    });

    links.link.list.forEach(function(el) {
      var li_el = document.createElement('li');
      li_el.className = 'lilevel1';
      var link = document.createElement('a');
      link.href = '#';
      link.onclick = function() {
        lnk.buildLink(el.url, el.urlType, el.maxZoom, el.params);
      };
      var text = document.createTextNode(el.label);
      link.appendChild(text);
      li_el.appendChild(link);
      // Append li element under matching category ul
      ul_el = document.getElementById('category-' + el.category);
      ul_el.appendChild(li_el);
    });
    // Add edit part
    appendList(ulEdit, links.edit.list);
    // Add check part
    appendList(ulChecks, links.check.list);
}
},{"./links.js":5}],5:[function(require,module,exports){
var SphericalMercator = require('sphericalmercator');
var merc = new SphericalMercator({
    size: 256
});

/*
 * Building link URL
 * url: service URL
 * urlType: type of coordinates permalink
 *   Exemples:
 *   - default:   ?lat=43&lon=1&zoom=16
 *   - default_z: ?lat=43&lon=1&z=16
 *   - gc:      ?lat=43&lng=1&z=16
 *   - gc_zoom:   #lat=43&lng=1&zoom=16
 *   - open_signal: ?lat=43&lng=1&initZoom=16
 *   - input_user:  ?lat=43&lon=1&zoom=16&u=userName
 *   - hash:    #map=16/43/1
 *   - hash2:     43,1/16
 *   - bbox:    ?bbox=43,O,44,1
 *   - c2c:     ?map_y=1&map_x=43&map_zoom=16
 *   - josm:    ?left=0&right=1&top=44&bottom=43
 *   - wikimapia: #lat=43&lon=1&z=16&m=b&lang=fr
 *   - googlemaps:  @43,1,7z
 *   - flickr:      ?fLat=44&fLon=1&zl=12
 *   - panoramio:   #lt=44&ln=1&z=4 (avec z=17-z)
 *   - wikiloc:     #lt=44&ln=1&z=4
 * maxZoom: max zoom used if provided (optionnal)
 * params: additionnal parameter to add in URL (optionnal)
 */
function buildLink(url, urlType, maxZoom, params) {

var goog_namespace = require('./google.js');
var xyz = goog_namespace.parseXYZFromUrl(window.location.href);

  // Coordinates
  var x = xyz[0]; // lon
  var y = xyz[1]; // lat
  var z = xyz[2]; // zoom

  // var xmin = this.map.getBounds().getWest();
  // var ymin = this.map.getBounds().getSouth();
  // var xmax = this.map.getBounds().getEast();
  // var ymax = this.map.getBounds().getNorth();
  var xmin = '';
  var ymin = '';
  var xmax = '';
  var ymax = '';

//window.screen.availWidth
//window.screen.availHeight

  // Current zoom or max zoom
  z = (typeof maxZoom != 'undefined' && z > maxZoom) ? maxZoom : zoom = z;

  switch (urlType) {
    case 'default':
      url += '?lat=' + y + '&lon=' + x + '&zoom=' + z + '&' + params;
      break;
    case 'default_z':
      url += '?lat=' + y + '&lon=' + x + '&z=' + z + '&' + params;
      break;
    case 'gc':
      url += '?lat=' + y + '&lng=' + x + '&z=' + z;
      break;
    case 'gc_zoom':
      url += '#lat=' + y + '&lng=' + x + '&zoom=' + z;
      break;
    case 'open_signal':
      url += '?lat=' + y + '&lng=' + x + '&initZoom=' + z;
      break;
    case 'hash':
      url += '#map=' + z + '/' + y + '/' + x;
      break;
    case 'hash2':
      url += y + ',' + x + '/' + z;
      break;
    case 'input_user':
      var user = prompt('What is your OSM user name ?');
      url += '?lat=' + y + '&lon=' + x + '&zoom=' + z + '&u=' + user;
      break;
    case 'bbox':
      url += '?bbox=' + ymin + ',' + xmin + ',' + ymax + ',' + xmax;
      break;
    case 'josm':
      url += '?left=' + xmin + '&right=' + xmax + '&top=' + ymax + '&bottom=' + ymin;
      break;
    case 'c2c':
      var centerPoint = merc.forward([x, y]);
      url += '?map_y=' + centerPoint[1] + '&map_x=' + centerPoint[0] + '&map_zoom=' + z;
      break;
    case 'wikimapia':
      url += '#lat=' + y + '&lon=' + x + '&z=' + z + params;
      break;
    case 'googlemaps':
      url += '@' + y + ',' + x + ',' + z + 'z';
      break;
    case 'flickr':
      url += '?fLat=' + y + '&fLon=' + x + '&zl=' + z;
      break;
    case 'panoramio':
            z = 17 - z;
      url += '#lt=' + y + '&ln=' + x + '&z=' + z;
      break;
    case 'wikiloc':
      url += '#lt=' + y + '&ln=' + x + '&z=' + z;
      break;
        default: // Same as default type
      url += '?lat=' + y + '&lon=' + x + '&zoom=' + z;
  }
  window.open(url, '_blank');
}

exports.buildLink = buildLink;

},{"./google.js":3,"sphericalmercator":1}],6:[function(require,module,exports){
/* Credits:
 * For initial idea, http://map.orhyginal.fr
 * https://github.com/orhygine/orhyginal-map/
 * Christophe aka Orhygine
 * Thomas Gratier
 */

var osmbookmarklet = {};

// Create main container
// var divBookmarklet = document.createElement('div');
// divBookmarklet.id = 'osmbookmarklet';

// get functions for DOM construction
html_element = require('./html-element.js');
// Create left HTML skeleton
var url = '//labs.webgeodatavore.com/osm-bookmarklet/osm-bookmarklet.png';
var divBookmarklet = html_element.createleftSideBar(url);

// Add the block to existing html body
document.body.appendChild(divBookmarklet);

// Load services list
var services = require('./external-services.js');

// Use services list to add content to previous content added
html_element.readLinks(services.links);

},{"./external-services.js":2,"./html-element.js":4}]},{},[6]);
