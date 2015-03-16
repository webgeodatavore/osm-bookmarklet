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