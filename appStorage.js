class AppStorage{
    constructor(appName){
        this.prefix = (appName ? appName + "." : "");
        this.localStorageSupported = (('localStorage' in window) && window['localStorage']);
    }

    isAppKey(key){
        if(this.prefix){
            return key.indexOf(this.prefix) === 0;
        }
        return true;
    }

    setValue(key,val){
        if (this.localStorageSupported)
            localStorage.setItem(this.prefix + key, JSON.stringify(val));
        return this;
    }

    getValue(key){
        if (this.localStorageSupported)
            return JSON.parse(localStorage.getItem(this.prefix + key));
        else return null;
    }

    removeValue(key){
        if (this.localStorageSupported)
            localStorage.removeItem(this.prefix + key);
        return this;
    }

    removeAll(){
        let keys = this.getKeys();
        for (let i in keys)    {
            this.removeValue(keys[i]);
        }
        return this;
    }

    getKeys(filter){
        let keys = [];
        if(this.localStorageSupported){
            for(let key in localStorage){
                if(this.isAppKey(key)){
                    if(this.prefix) key = key.slice(this.prefix.length);
                    if(!filter || filter[key]) keys.push(key);
                }
            }
        }
        return keys;
    }

    contains(key){
        return this.getKeys(key) !== null;
    }
}
