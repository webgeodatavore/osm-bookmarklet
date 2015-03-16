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
