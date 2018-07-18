require(['jquery', 'swiper', 'bscroll', 'GetSlideDirection', 'render', 'text!bookTB', 'text!indexTpl', 'text!bookLR'], function($, swiper, bscroll, GetSlideDirection, render, bookTB, indexTpl, bookLR) {
    console.log(bookTB);

    $('body').append(indexTpl);
    $('body').append(bookTB);
    $('body').append(bookLR);

    //缓存元素
    var _line = $('.line'),
        _parent = $('.book-city>div');

    //实例化bscroll

    var cityScroll = new bscroll('.book-city', {
        probeType: 2,
        click: true
    });

    //     44        x
    // ------  =   --------
    // 37.5           64   
    var htmlFz = document.getElementsByTagName('html')[0].style.fontSize;

    var ruleHeight = 44 * parseInt(htmlFz) / 37.5;

    //监听滚动事件
    cityScroll.on('scroll', function() {
        if (this.y < this.maxScrollY - ruleHeight) {
            if (pagenum < total) {
                _parent.attr('up', '释放加载更多');
            } else {
                _parent.attr('up', '已经到底');
            }
        } else if (this.y < this.maxScrollY - ruleHeight / 2) {
            if (pagenum < total) {
                _parent.attr('up', '上拉加载');
            } else {
                _parent.attr('up', '已经到底');
            }
        } else if (this.y > ruleHeight) {
            _parent.attr('down', '释放刷新');
        }
    })

    var pagenum = 1,
        total = 3;

    //监听touchEnd 

    cityScroll.on('touchEnd', function() {
        if (_parent.attr('up') === '释放加载更多') {
            console.log("上拉加载更多");
            if (pagenum < total) {
                pagenum++;
                getRecommend(pagenum);
                _parent.attr('up', '上拉加载');
            } else {
                _parent.attr('up', '已经到底');
            }
        } else if (_parent.attr('down') === '释放刷新') {
            location.reload();
        }
    })

    getRecommend(pagenum);

    //获取推荐的数据
    function getRecommend(pagenum) {
        $.ajax({
            url: '/api/recommend?pagenum=' + pagenum,
            dataType: 'json',
            success: function(res) {
                console.log(res);
                if (res.code === 1) {
                    render("#l-r-tpl", ".loadmore", res.data.items);
                    cityScroll.refresh();
                }
            },
            error: function(error) {
                console.warn(error)
            }
        })
    }

    //实例化wrap-swiper
    var wrapSwiper = new swiper('.wrap-swiper');

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
        cityScroll.refresh();

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

})