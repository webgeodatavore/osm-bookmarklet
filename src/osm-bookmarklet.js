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
