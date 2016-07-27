(function main() {
    
    $("#wrap").css("min-width", "300");
    $('body').append('<div id="who">???</div>');

         
    $('.inner .signature').each( function() {
        $(this).prepend( "<p>+</p>" );
        /*marche mais pas bon si post est trop long : fignature hors ecran
        var idpost= $(this).attr('id').substring(3); // sig123456

        $('#profile'+idpost+' dt a').hover( 
            function() {
            $( '#sig'+idpost ).css({ 
                'overflow-y':'hidden',
                'background-color': '#fff',
                'height':'auto'});
            }, function() {
            $( '#sig'+idpost ).css( {
                'overflow-y':'auto',
                'background-color': '#eee',
                'height':'1em' });
            }
        );
        */
    });
    
    function notifier(text,duree=3000){
        var n=new Notification('Manjaro.fr Forum', {
            icon: 'https://github.com/papajoker/ex-manjarofr/raw/master/res/manjaro-logo.48.png',
            body: text
        });
        n.onshow = function () { 
            setTimeout(n.close.bind(n), duree); 
        }
    }


    $('object').each(function( index, element ) {
        var src= $( this ).find('param:first').first().attr("value");
        var youtube = src.indexOf('/v/');
        if ( youtube != -1 ) {
            // c'est du youtube
            src= src.replace('\/v\/','\/embed\/')+'?rel=0&vq=hd720'
            //console.log("source video: "+src);
            $(this).replaceWith('<iframe width="576" height="324" src="' + src + '" frameborder="0" allowfullscreen></iframe>');
        }
    });

    function getWho(id) {
        var whows = document.getElementsByClassName("username-coloured");
        var ret='';
        $('#page-body h3 + p a.username-coloured').each(function(){
            var color= $(this).css('color')
            ret = ret + ' -&gt; <span style="color:' + color + '">' + $(this).text() +'</span>'; 
        });
        $(id).html(ret);
    }

    /*
    pas d'intéret :)
    getWho('#who');
    */

    $('div.post li.quote-icon').each(function(){
        var src=$(this).find('a').attr('href').replace('posting.php','viewtopic.php');
        var id=src.substr(src.lastIndexOf("="));
        var title=$(this).parents('div.postbody').find('h3:first').text();
        $(this).after('<li class="fav-icon"><a href="#" title="Favoris" data-href="'+src+'" data-title="'+title+'"><span>F</span></a></li>');
    });
    $( "li.fav-icon a" ).click(function(event) {
        event.preventDefault();
        chrome.runtime.sendMessage({ action: 'setbookmark', href: $(this).data('href'), title: $(this).data('title') }, function(isok){
            notifier( (isok)?"Favoris ajouté":'Favoris supprimé' );
        });
    });


})();
