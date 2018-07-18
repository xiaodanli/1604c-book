define(function() {
    var storage = window.localStorage;

    //setItem  getItem  removeItem  clear
    //setItem(key,val)  注：val必须是字符串
    //getiem(key)   注：值也是字符串
    var storageFun = {
        set: function(key, val) {
            if (!val) {
                storage.removeItem(key)
            } else {
                storage.setItem(key, JSON.stringify(val))
            }
        },

        get: function(key) {
            var val = JSON.parse(storage.getItem(key));

            return val
        },

        remove: function(key) {
            storage.removeItem(key);
        },

        clear: function() {
            storage.clear();
        }
    }

    return storageFun
})