require(['jquery', 'render', 'text!searchTpl', 'lazyload', 'storage'], function($, render, searchTpl, lazyload, storage) {
    $('body').append(searchTpl);

    //点击icon-back
    $('.icon-back').on('click', function() {
        location.href = '/';
    })

    //获取热门搜索关键词
    $.ajax({
        url: '/api/search-hot',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                render("#tag-tpl", ".hot", res.data.ads)
            }
        },
        error: function(error) {
            console.log(error)
        }
    })

    //缓存元素
    var _tagWrap = $(".tag-wrap"),
        _searchList = $(".search-list"),
        _ipt = $('.ipt');
    //点击搜索
    $(".search-btn").on("click", function() {
        var val = _ipt.val();
        if (!val) {
            _searchList.html('<p>输入内容为空</p>');
            _tagWrap.hide();
            _searchList.show();
        } else {
            searchFun(val);
        }
    })

    // [{ad_name:'诛仙'},{ad_name：'睡觉'}]
    var history = storage.get('history') || [];
    if (history.length > 0) {
        render('#tag-tpl', '.history', history, true);
        $('.history-title').show();
    }

    function searchFun(val) {
        var isHas = history.some(function(item) {
            return item.ad_name === val
        })
        if (!isHas) {
            history.push({ ad_name: val });
            storage.set('history', history);
        }

        $.ajax({
            url: '/api/search?key=' + val,
            dataType: 'json',
            success: function(res) {
                console.log(res);
                _tagWrap.hide();
                _searchList.show();
                if (res.code === 1) {
                    if (!res.data) {
                        _searchList.html('<p>没有相应的数据</p>');
                    } else {
                        render("#search-template", ".search-list", res.data.items, true);
                        //图片懒加载
                        $('img[data-original]').lazyload({
                            effect: "fadeIn",
                            threshold: 200,
                            container: $('.search-list')
                        })
                    }
                }

            },
            error: function(error) {
                console.warn(error)
            }
        })
    }

    //监听input事件
    _ipt.on('input', function() {
        if (!$(this).val()) {
            _tagWrap.show();
            _searchList.hide();
            render('#tag-tpl', '.history', history, true);
            $('.history-title').show();
        }
    })

    //点击热门搜索关键词
    $('.tag-wrap').on('click', 'li', function() {
        var txt = $(this).text();
        _ipt.val(txt);
        searchFun(txt);
    })
})