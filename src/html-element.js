exports.createContentShortcuts = createContentShortcuts;
exports.createToogleButton = createToogleButton;
exports.readLinks = readLinks;

lnk = require('./links.js');

function createContentShortcuts() {
  //Create a first block
  var leftBlock = document.createElement('div');
  leftBlock.id = 'osmshortcuts';
  leftBlock.style = 'display:none;';

  // Create 3 sub-blocks
  var div_edit = document.createElement('div');
  div_edit.id = 'edit';
  h2_edit = document.createElement('h2');
  h2_edit.textContent = 'Openstreetmap editing';
  div_edit.appendChild(h2_edit);

  var div_check = document.createElement('div');
  div_check.id = 'check';
  h2_check = document.createElement('h2');
  h2_check.textContent = 'Openstreetmap control';
  div_check.appendChild(h2_check);

  var div_link = document.createElement('div');
  div_link.id = 'link';
  h2_link = document.createElement('h2');
  h2_link.textContent = 'Link to other web maps';
  div_link.appendChild(h2_link);

  // Append them to the first block
  leftBlock.appendChild(div_edit);
  leftBlock.appendChild(div_check);
  leftBlock.appendChild(div_link);
  return leftBlock;
}

// Create div for logo
function createToogleButton(url) {
  var divLogo = document.createElement('div');
  divLogo.id = 'osmbutton';
  // Then create "a" tag
  var aLogo = document.createElement('a');
  aLogo.href = '#';
  aLogo.onclick = function(e) {
    var osmshortcuts = document.getElementById('osmshortcuts');
    if (osmshortcuts.style.display == 'none') {
      osmshortcuts.style.display = 'initial';
    } else {
      osmshortcuts.style.display = 'None';
    }
  };
  // Create img and set src
  var imgLogo = document.createElement('img');
  imgLogo.src = url;
  // Append img to a, a to div and add the div to the body
  aLogo.appendChild(imgLogo);
  divLogo.appendChild(aLogo);
  return divLogo;
}

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