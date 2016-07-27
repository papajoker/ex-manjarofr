"use strict";

const urlFofo   = 'http://www.manjaro.fr/forum/';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'setbookmark': 
      var bookmarks   = new Bookmarks('bookmarks').load();
      var ret=bookmarks.add(urlFofo,request.href,request.title);
      bookmarks.save();
      sendResponse(ret);
      break;
  }
}); 

/*

voir The Great Suspender
~/.config/chromium/Default/Extensions/klbibkeccnjlkjkiokjodocebajanakg/6.16_0/js/
    background.js
    manifest.json
pour ajouter commandes menu click droit dans le site

*/