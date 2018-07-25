define(['jquery', 'render', 'bscroll'], function($, render, bscroll) {

    var _parent = $('.book-city>div');
    //实例化bscroll

    var cityScroll = new bscroll('.book-city', {
        probeType: 2,
        click: true
    });

    //   44            x
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

    return cityScroll

})