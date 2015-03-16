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