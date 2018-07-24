require(['jquery', 'render', 'getRequest', 'text!listTpl', 'lazyload'], function($, render, getRequest, listTpl, lazyload) {
    $('body').append(listTpl);
    var type = getRequest.type;

    var _listContent = $('.list-content');
    getList();

    function getList() {
        $.ajax({
            url: '/api/list?type=' + type,
            dataType: 'json',
            success: function(res) {
                console.log(res);

                if (res.code === 1) {
                    render('#list-tpl', '.list-wrap', res.data.items);
                    $('img[data-original]').lazyload({
                        container: _listContent
                    })

                    _listContent.on('scroll', loadmore);
                }
            },
            error: function(error) {
                console.warn(error)
            }
        })
    }

    var boxHeight = _listContent.height();

    function loadmore() {
        var conHeight = $('.list-wrap').height();
        var maxScrollHeight = conHeight - boxHeight;
        if (_listContent.scrollTop() > maxScrollHeight - 40) {
            _listContent.off('scroll');
            getList();
        }
    }

    //点击back
    $('.icon-back').on('click', function() {
        location.href = '/';
    })
})

//内容 6140

//盒子：1059

//maxScrollHeight = 6140-1059 

//加载条件  maxScrollHeight - 40

//better-scroll       原生的上拉 

//  最外层盒子           

// overflow：hidden    overflow-y:scroll