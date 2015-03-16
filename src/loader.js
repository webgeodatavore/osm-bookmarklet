// To simulate production, do
//NODE_ENV=production node app.js
// var common = require('./../common');
// var config = common.config();
// Bug when inlining using Browserify
(function() {
  var config = {
    'development': {
      'script_url_http': '//labs.webgeodatavore.com/osm-bookmarklet/osm-bookmarklet.build.js',
      'css_url_http': '//labs.webgeodatavore.com/osm-bookmarklet/main.css',
      'script_url_https': '//webgeodatavore.github.io/osm-bookmarklet/osm-bookmarklet.build.js',
      'css_url_https': '//webgeodatavore.github.io/osm-bookmarklet/main.css'
    }, 
    'production': {
      'script_url': '//webgeodatavore.github.io/osm-bookmarklet/osm-bookmarklet.js',
      'css_url': '//webgeodatavore.github.io/osm-bookmarklet/main.css'
    }
  };

  config = config.development;

  var lang;
  if (navigator.languages) {
    lang = navigator.languages[0];
  } else {
      lang = (navigator.language || navigator.userLanguage);
  }

  var cssCode = document.createElement('link');
  cssCode.setAttribute('rel', 'stylesheet');
  cssCode.setAttribute('href', config.css_url);
  document.body.appendChild(cssCode);

  var jsCode = document.createElement('script');
  jsCode.setAttribute('src', config.script_url);
  document.body.appendChild(jsCode);
})();
