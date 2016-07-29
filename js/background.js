"use strict";

const urlFofo = 'http://www.manjaro.fr/forum/';

function notifier(text, duree = 3000, title = 'Nouveau Post') {
  var n = new Notification(title, {
    icon: chrome.extension.getURL('res/manjaro-logo.48.png'),
    body: text
  });
  n.onshow = function() {
    setTimeout(n.close.bind(n), duree);
  }
}

/*
 * réception des messages venant du forum
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'setbookmark':
      var bookmarks = new Bookmarks('bookmarks').load();
      var ret = bookmarks.add(urlFofo, request.href, request.title);
      bookmarks.save();
      sendResponse(ret);
      break;
  }
});


/*
 *PUSH notifications de nouveaux posts
 */
const timerPush = 60000 // 60 secondes;
  //const timerPush=120000 // toutes les 2 minutes
  //TODO: duree du timer a mettre dans fenetre options

var histories = new Urls('posts').load();
var modif = false;
var timerid = window.setInterval(function() {
    histories.load();
    //notifier('setInterval',500,'test');
    // charge les nouveaux posts non lus
    $.get(urlFofo + "search.php?search_id=newposts", function(data, status, xhr) {
      $(data).find("a[href$='unread']").each(function() {
        var href = $(this).attr('href');
        if (!histories.exists(href)) { // pas encore notifié
          notifier($(this).next('a').text(), 6000);
          histories.add(href);
          modif = true;
          //clearInterval(timerid);        
        }
      });
      if (modif) {
        histories.save();
      }
    });
  }, timerPush // 30000 toutes les 30 secondes
);

/*

voir The Great Suspender
~/.config/chromium/Default/Extensions/klbibkeccnjlkjkiokjodocebajanakg/6.16_0/js/
    background.js
    manifest.json
pour ajouter commandes menu click droit dans le site

*/