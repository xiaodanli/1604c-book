require(['jquery', 'swiper', 'GetSlideDirection', 'render', 'text!bookTB', 'text!indexTpl', 'text!bookLR', 'storage', 'loadRefresh'], function($, swiper, GetSlideDirection, render, bookTB, indexTpl, bookLR, storage, loadRefresh) {
    console.log(bookTB);

    $('body').append(indexTpl);
    $('body').append(bookTB);
    $('body').append(bookLR);

    //缓存元素
    var _line = $('.line');


    //实例化wrap-swiper
    var wrapSwiper;

    //滑动处理
    var startX, startY;
    document.addEventListener('touchstart', function(ev) {
        startX = ev.touches[0].pageX;
        startY = ev.touches[0].pageY;
    }, false);
    document.addEventListener('touchend', function(ev) {
        var endX, endY;
        endX = ev.changedTouches[0].pageX;
        endY = ev.changedTouches[0].pageY;
        var direction = GetSlideDirection(startX, startY, endX, endY);
        switch (direction) {
            case 3:
                console.log("xiangzuo")
                swiperFun(1);
                break;
            case 4:
                console.log("xiangyou")
                swiperFun(0);
                break;
            default:
        }
    }, false);

    function swiperFun(num) {
        wrapSwiper.slideTo(num);
        $('.tab-item').eq(num).addClass('active').siblings().removeClass('active');
        if (num == 1) {
            _line.addClass('move');
        } else {
            _line.removeClass('move');
        }
    }

    //点击tab
    $('.tab-wrap').on('click', '.tab-item', function() {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');

        if (index == 1) {
            _line.addClass('move');
        } else {
            _line.removeClass('move');
        }

        wrapSwiper.slideTo(index);
    })

    //实例化banner swiper
    var bannerSwiper = new swiper('.banner-wrap', {
        autoplay: 3000,
        loop: true
    })

    //请求数据

    $.ajax({
        url: '/api/index',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                renderIndex(res.data);
            }
        },
        error: function(error) {
            console.warn(error)
        }
    })

    var recommendData = [];
    //渲染首页数据

    function renderIndex(res) {

        //swiper 数据

        var swiperData = res.items[0].data.data.filter(function(item) {
            return item.size != 0
        })

        render("#banner-tpl", ".banner", swiperData);

        //types 数据

        var typesData = res.items[0].data.data.filter(function(item) {
            return item.size == 0
        })

        render("#type-tpl", ".types", typesData);

        //本周最火

        var hotData = res.items[1].data.data;
        render("#book-t-b", ".hot", hotData);

        //重磅推荐
        // [
        //     [{},{},{},{},{}],
        //     [{},{},{},{},{}]
        // ]

        // console.log(format(res.items[2].data.data, 5));

        recommendData = format(res.items[2].data.data, 5);

        function format(data, num) {
            var len = Math.ceil(data.length / 5);

            var target = [];

            for (var i = 0; i < len; i++) {
                target.push(data.splice(0, 5))
            }

            return target
        }

        render("#recommend-tpl", ".recommed", recommendData[0], true);

        $('.content').show();

        wrapSwiper = new swiper('.wrap-swiper');

        loadRefresh.refresh();

    }
    var changeNum = 0;
    //点击换一换
    $(".change-btn").on("click", function() {
        changeNum++;
        if (changeNum === recommendData.length) {
            changeNum = 0;
        }
        render("#recommend-tpl", ".recommed", recommendData[changeNum], true);
    })

    //点击switch-btn

    $(".switch-btn").on("click", function() {
        $(".shelf-list").toggleClass("change-style");
    })

    //点击类别
    $('.types').on('click', 'dl', function() {
        var txt = $(this).find('dd').text();
        var type;
        if (txt == '女生') {
            type = 'female';
        } else if (txt == '男生') {
            type = 'man'
        }
        location.href = '../../page/list.html?type=' + type;
    })

    //点击hot 列表
    $('.hot').on('click', 'li', function() {
        var fiction_id = $(this).attr('data-id');

        location.href = '../../page/detail.html?fiction_id=' + fiction_id;
    })

    //
    $('.icon-person').on('click', function() {
        var code = storage.get('code') || 0;
        if (code) {
            location.href = '../../page/my.html';
        } else {
            location.href = '../../page/login.html';
        }
    })

})