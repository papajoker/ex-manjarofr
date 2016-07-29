"use strict";

const urlFofo = 'http://www.manjaro.fr/forum/';
var tabid = -1;
var urls = new Urls('urls').load();
var bookmarks = new Bookmarks('bookmarks').load();

function onclick(event) {
    event.preventDefault();
    var src = urlFofo + event.currentTarget.getAttribute("href");
    urls.add(src);
    if (tabid == -1) {
        chrome.tabs.create({
            url: src,
            selected: true
        });
    } else {
        chrome.tabs.update(tabid, {
            url: src,
            selected: true
        });
    }
    urls.save();
}

function setBookmark(id, title) {
    bookmarks.load();
    bookmarks.add(urlFofo, id, title);
    bookmarks.save();
}

(function main() {

    chrome.tabs.query({
        "url": ["*://www.manjaro.fr/*"]
    }, function(tabs) {
        if (typeof tabs !== 'undefined' && tabs.length) {
            tabid = tabs[0].id
        }
    });

    $('header a').click(onclick);

    /* ------------------------- */

    $.get(urlFofo + "index.php", function(data, status, xhr) {
        var tmp = $(data).find('li.icon-logout').text();
        if ('Connexion' == tmp) {
            getNews('active_topics');
            var status = 'non connecté';
            $("#status").html(status);
        } else {
            getNews('newposts');
            var status = 'connecté';
        }
        $("#status").html(status);

        chrome.runtime.sendMessage({
            //TODO: reglage dans options
            action: 'notify',
            txt: status,
            duree: 2000
        });
    });


    /* ------------------------- */

    function getNews(action) {
        $("#news").load(urlFofo + "search.php?search_id=" + action + " .forumbg", function(response, status, xhr) {
            if (status == "error") {
                $("#status").html("une Erreur : " + xhr.status + " " + xhr.statusText);
                alert("une Erreur : " + xhr.status + " " + xhr.statusText);
            } else {
                $("#status").html("chargement ... " + xhr.status + " " + xhr.statusText);
                var title = '';
                $('#news li a').each(function() {
                    var tmp = $(this).attr('href').indexOf('#p');
                    if (tmp == -1) {
                        if ($(this).hasClass('topictitle')) {
                            title = $(this).text();
                        }
                        var classe = $(this).attr('class');
                        $(this).replaceWith('<span class="' + classe + '">' + $(this).text() + '</span>');
                    } else {
                        $(this).addClass("fl");
                        var src = $(this).attr("href");
                        if (urls.exists(urlFofo + src)) {
                            // post dejà visité
                            $(this).html('<span class="fa fa-external-link" title="revoir"></span>');
                            var classname = (bookmarks.exists(src) != -1) ? ' bookmarked' : '';
                            var newb = $('<i class="fa fa-certificate' + classname + '" xaria-hidden="true" data-title="' + title + '" title="marquer"></i>').click(function(event) {
                                setBookmark(src, event.currentTarget.getAttribute("data-title"));
                                $(event.currentTarget).toggleClass("bookmarked");
                            });
                            $(this).before(newb);
                        } else {
                            $(this).html('<span class="fa fa-external-link-square" title="consulter"></span>');
                        }
                        $(this).click(onclick);
                    }
                });
                $('#news br').remove();
                $('#news img').replaceWith('<span/>');
            }
        });
    }



    /* ------------------------- */

    $("#who").load(urlFofo + "index.php #page-body h3+p a.username-coloured", function() {
        //$('#who a').attr('target','manjaro');
        $('#who a').attr('href', function() {
            var src = $(this).attr("href");
            $(this).attr("href", src).click(onclick);
        });
        $('#who a:last').attr('title', 'dernier entré');
    });

    /* ------------------------- */

    function getBookmarks() {
        $("#news").html('chargement des favoris');
        var ret = '';
        bookmarks.load().items.forEach(function(fav) {
            ret += '<li><div><a href="' + fav.id + '" class="fav-title"><b>' + fav.title + '</b></a></div>';
            ret += '<div><i class="fa fa-trash" data-title="' + fav.title + '" data-id="' + fav.id + '" title="supprimer"></i></div>';
            ret += '</li>';
        });

        $("#news").html('<ul class="fav">' + ret + '</ul>');
        $("#news a").click(onclick);
        $('#news i.fa-trash').click(function(event) {
            if (confirm("Supprimer ce favoris ?") == true) {
                setBookmark(event.currentTarget.getAttribute("data-id"), event.currentTarget.getAttribute("data-title"));
                getBookmarks();
            }
        });
    }

    /* ------------------------- */

    $('#onder').click(function() {
        event.preventDefault();
        getNews('active_topics');
    });

    $('#onnew').click(function() {
        event.preventDefault();
        getNews('newposts');
    });
    $('#onbookmark').click(function() {
        event.preventDefault();
        getBookmarks();
    });


})();