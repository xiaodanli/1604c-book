define(function() {
    //?type=female&age=10
    var url = location.search;

    var params = {};

    if (url.indexOf('?') != -1) {
        url = url.substr(1); //type=female&age=10

        var arr = url.split('&');

        arr.forEach(function(item) {
            var itemArr = item.split('='); //[type,female]   [age,10]

            params[itemArr[0]] = itemArr[1];
        })

    }

    return params
})