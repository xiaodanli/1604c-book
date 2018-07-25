require(['jquery', 'render', 'getRequest', 'bscroll', 'storage'], function($, render, getRequest, bscroll, storage) {
    var fiction_id = getRequest.fiction_id;

    var already = storage.get(fiction_id + 'alreay') || [];

    console.log(already);

    $.ajax({
        url: '/api/chapterList?fiction_id=' + fiction_id,
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                already.forEach(function(item) {
                    res.data.item.toc[item].already = true;
                })

                console.log(res.data.item.toc)

                render('#chapter-template', '.chapter-list', res.data.item.toc);
                var chapterScroll = new bscroll('.chapter-wrap', {
                    click: true
                })

                var index = getRequest.chapter_id || $('.chapter-list li').length - 1;
                var target = $('.chapter-list li').eq(index)[0];
                chapterScroll.scrollToElement(target);
                $('.chapter-list li').eq(index).addClass('active');

            }
        },
        error: function(error) {
            console.log(error)
        }
    })


    $('.icon-back').on('click', function() {
        if (getRequest.chapter_id) {
            location.href = '../../page/artical.html?fiction_id=' + fiction_id;
        } else {
            location.href = '../../page/detail.html?fiction_id=' + fiction_id;
        }
    })

    $('.chapter-list').on('click', 'li', function() {
        var chapter_id = $(this).attr('data-id');
        storage.set(fiction_id, chapter_id);
        location.href = '../../page/artical.html?fiction_id=' + fiction_id;
    })
})