function Urls(key){
    this.key =key; // urls
    this.items=[];
}

Urls.prototype.load = function(){
    this.items = JSON.parse( localStorage.getItem(this.key) );
    if (!Array.isArray(this.items)) {    
        this.items=[]; 
        this.save();
    }
    return this;
}

Urls.prototype.save = function(){
    localStorage.setItem(this.key, JSON.stringify(this.items.slice(0, 24)));
    return this;
}

Urls.prototype.add = function(url) {
    if ( this.items.indexOf(url) == -1 ) {
         this.items.unshift(url);
    }
    return this;
}

Urls.prototype.exists = function (url) {
    return this.items.indexOf(url) != -1;
}
