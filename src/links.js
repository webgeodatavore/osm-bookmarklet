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
