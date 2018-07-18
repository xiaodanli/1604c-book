define(['jquery', 'handlebars'], function($, handlebars) {
    var render = function(tpl, target, data, isHtml) {
        var tpl = $(tpl).html();

        var template = handlebars.compile(tpl);

        handlebars.registerHelper('first', function(index) {
            return index === 0
        })

        handlebars.registerHelper('addIndex', function(index) {
            return index + 1
        })

        var html = template(data);

        if (isHtml) {
            $(target).html(html);
        } else {
            $(target).append(html);
        }
    }
    return render
})