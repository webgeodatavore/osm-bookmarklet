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
      'script_url_http': '//labs.webgeodatavore.com/osm-bookmarklet/osm-bookmarklet.build.js',
      'css_url_http': '//labs.webgeodatavore.com/osm-bookmarklet/main.css',
      'script_url_https': '//webgeodatavore.github.io/osm-bookmarklet/osm-bookmarklet.build.js',
      'css_url_https': '//webgeodatavore.github.io/osm-bookmarklet/main.css'
    }
  };

  config = config.development;

  var lang;
  if (navigator.languages) {
    lang = navigator.languages[0];
  } else {
      lang = (navigator.language || navigator.userLanguage);
  }

  var url_css = config.css_url_http;
  var url_script = config.script_url_http;

  if (window.location.protocol === 'https:') {
    url_css = config.css_url_https;
    url_script = config.script_url_https;
  }

  var cssCode = document.createElement('link');
  cssCode.setAttribute('rel', 'stylesheet');
  cssCode.setAttribute('href', url_css);
  document.body.appendChild(cssCode);

  var jsCode = document.createElement('script');
  jsCode.setAttribute('src', window.location.protocol + url_script);
  document.body.appendChild(jsCode);
})();
