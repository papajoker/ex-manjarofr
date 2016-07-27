
function Bookmarks(key){
    this.key =key; // bookmarks
    this.items=[];
}

Bookmarks.prototype.load = function(){
    this.items = JSON.parse( localStorage.getItem(this.key) );
    if(!Array.isArray(this.items)) {    
        this.items=[]; 
        this.save();
    }
    return this;
}

Bookmarks.prototype.save = function(){
    localStorage.setItem(this.key, JSON.stringify(this.items.slice(0, 64)));
    return this;
}


Bookmarks.prototype.add = function(url,id,title) {
    var idx=this.exists(id);
    if ( idx == -1 ) {
        this.items.unshift({'url':url, 'id':id, 'title':title});
        return true;
    }
    else {
        this.items.splice(idx, 1);
        return false;
    }
}

Bookmarks.prototype.delete = function(id) {
    var idx=this.exists(id);
    if ( idx != -1 ) {
        this.items.splice(idx, 1);
    }
    return this;
}

Bookmarks.prototype.exists = function (id) {
    return this.items.findIndex( function(element, index, array) {
        if (element.id==id){
            return true;
        }
        return false;
    });
}