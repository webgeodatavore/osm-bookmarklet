/* Credits:
 * For initial idea, http://map.orhyginal.fr
 * https://github.com/orhygine/orhyginal-map/
 * Christophe aka Orhygine
 * Thomas Gratier
 */

// Create main container
var divBookmarklet = document.createElement('div');
divBookmarklet.id = 'osmbookmarklet';

// get functions for DOM construction
html_element = require('./html-element.js');
// Create a first block
var leftBlock = html_element.createContentShortcuts();
// Add the first block to main container
divBookmarklet.appendChild(leftBlock);

// Create button for opening/closing the window
var buttonLogo = html_element.createToogleButton('//labs.webgeodatavore.com/osm-bookmarklet/osm-bookmarklet.png');

// Add the button to the main block
divBookmarklet.appendChild(buttonLogo);

// Add the block to existing html body 
document.body.appendChild(divBookmarklet);

/*
Links to Openstreetmap editing tools on the current bounding box
Openstreetmap editing

Links to Openstreetmap checking tools on the current bounding box
Openstreetmap control

Links to external map web sites on the current bounding box
Link to other web maps
*/
// Load services list
var services = require('./external-services.js');

// Use services list to add content to previous content added
html_element.readLinks(services.links);
