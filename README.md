# OSM bookmarklet

<p align="center">
  <a id="bookmarklet" href='javascript:(function(){var config={development:{script_url_http:"//labs.webgeodatavore.com/osm-bookmarklet/osm-bookmarklet.build.js",css_url_http:"//labs.webgeodatavore.com/osm-bookmarklet/main.css",script_url_https:"//webgeodatavore.github.io/osm-bookmarklet/osm-bookmarklet.build.js",css_url_https:"//webgeodatavore.github.io/osm-bookmarklet/main.css"},production:{script_url_http:"//labs.webgeodatavore.com/osm-bookmarklet/osm-bookmarklet.build.js",css_url_http:"//labs.webgeodatavore.com/osm-bookmarklet/main.css",script_url_https:"//webgeodatavore.github.io/osm-bookmarklet/osm-bookmarklet.build.js",css_url_https:"//webgeodatavore.github.io/osm-bookmarklet/main.css"}};config=config.development;var lang;if(navigator.languages){lang=navigator.languages[0]}else{lang=navigator.language||navigator.userLanguage}var url_css=config.css_url_http;var url_script=config.script_url_http;if(window.location.protocol==="https:"){url_css=config.css_url_https;url_script=config.script_url_https}var scripts=Array.prototype.slice.call(document.scripts);var countSameUrl=scripts.filter(function(el){if(el.src===window.location.protocol+url_script){return true}});if(countSameUrl.length===0){var cssCode=document.createElement("link");cssCode.setAttribute("rel","stylesheet");cssCode.setAttribute("href",url_css);document.body.appendChild(cssCode);var jsCode=document.createElement("script");jsCode.setAttribute("src",window.location.protocol+url_script);document.body.appendChild(jsCode)}})();'>
    <img width="220" height="220" src="src/img/noun_14010_cc.svg" alt="OSM Bookmarklet" class="inline-img index-bookmarklet">
  </a>
  <img style="position: absolute; margin-left: 10px; width: 200px; margin-top: -7px;" src="src/img/osm-bookmarklet.png" alt="drag-indicator" class="inline-img">
</p>

This project is an attempt to help people discover various web services offered by OpenStreetMap and it ecosystem.

It helps syncing center and zoom for each URL. It's not restricted to go from commercial maps to OpenStreetMap (OSM) but also between various web maps available within OSM ecosystem.

At the moment, it only works on Google Maps website.

The idea comes from the website http://map.orhyginal.fr (we also borrowed a large part of the code, previously available on Github) but we choose to untied the component (using URL to get center) and make it into a bookmarklet.

A more simple bookmarklet https://twitter.com/osmbuildings/status/501810389274066944 is available too but also more limited ;)


Credits for logo :

Icon created by Ilsur Aptukov - The Noun Project - http://thenounproject.com/term/map/14010/
This icon is licensed as Creative Commons – Attribution (CC BY 3.0) http://creativecommons.org/licenses/by/3.0/us/