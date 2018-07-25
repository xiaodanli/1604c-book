require(['jquery', 'storage', 'getRequest', 'base64', 'render'], function($, storage, getRequest, base64, render) {

    var _setWrap = $('.set-wrap'),
        _setPanel = $('.set-panel');

    //点击大小
    var initFz = storage.get('fz') || 14,
        minFz = 10,
        maxFz = 30;


    var fiction_id = getRequest.fiction_id;

    var chapter_id = storage.get(fiction_id) || 1; //默认加载第一章

    var already = storage.get(fiction_id + 'alreay') || [];

    $('.cur').html(chapter_id);

    getArtical(fiction_id, chapter_id);

    function getArtical(fiction_id, chapter_id) {
        $.ajax({
            url: '/api/artical?fiction_id=' + fiction_id + '&chapter_id=' + chapter_id,
            dataType: 'json',
            success: function(res) {
                var jsonpUrl = res.data.jsonp;

                var script = document.createElement('script');

                script.src = jsonpUrl;

                window.duokan_fiction_chapter = function(data) {
                    var articalCon = JSON.parse($.base64().decode(data));
                    render('#artical-tpl', '.artical-con', articalCon, true);
                    $('.artical-con p').css('fontSize', initFz / 37.5 * 1 + 'rem');
                    if (already.indexOf(chapter_id) == -1) {
                        already.push(chapter_id);
                        storage.set(fiction_id + 'alreay', already);
                    }
                }

                document.body.appendChild(script);

            },
            error: function(error) {
                console.log(error);
            }
        })
    }



    //点击下一章
    $('.next-btn').on('click', function() {
        if (chapter_id < 4) {
            chapter_id++;
            $('.cur').html(chapter_id);
            getArtical(fiction_id, chapter_id);
        } else {
            alert('已经到最后一章');
        }
        storage.set(fiction_id, chapter_id);
    })

    //点击上一章
    $('.prev-btn').on('click', function() {
        if (chapter_id > 1) {
            chapter_id--;
            $('.cur').html(chapter_id);
            getArtical(fiction_id, chapter_id);
        } else {
            alert('已经到第一章');
        }
        storage.set(fiction_id, chapter_id);
    })

    //获取总章节

    $.ajax({
        url: '/api/chapterList?fiction_id=' + fiction_id,
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {

                $('.total').html(res.data.item.toc.length);
            }
        },
        error: function(error) {
            console.log(error)
        }
    })

    //点击目录
    $('.chapter-btn').on('click', function() {
        location.href = '../../page/chapter-list.html?fiction_id=' + fiction_id + '&chapter_id=' + chapter_id;
    })

    //点击fanhui

    $('.icon-circle-back').on('click', function() {
        location.href = '../../page/detail.html?fiction_id=' + fiction_id
    })

    //点击内容

    $('.artical-con').on('click', function() {
        _setWrap.show();
    })

    //点击mask
    $('.mask').on('click', function() {
        _setWrap.hide();
        _setPanel.hide();
        $('.font-btn').removeClass('active');
    });

    //点击字体
    $('.font-btn').on('click', function() {
        _setPanel.toggle();
        $(this).toggleClass('active');
    })



    //点击大
    $('.big-btn').on('click', function() {
        if (initFz < maxFz) {
            initFz += 2;
        }
        storage.set('fz', initFz);
        $('.artical-con p').css('fontSize', initFz / 37.5 * 1 + 'rem');
    })

    //点击小
    $('.small-btn').on('click', function() {
        if (initFz > minFz) {
            initFz -= 2;
        }
        storage.set('fz', initFz);
        $('.artical-con p').css('fontSize', initFz / 37.5 * 1 + 'rem');
    })

    //设置背景

    var tag = storage.get('tag') || '夜间';

    var status = tag === '夜间' ? true : false; //背景显示白天的状态 ----> 字显示的是夜间

    var bg = storage.get('bg') || '#f7eee5'; //初始的颜色

    var index = storage.get('index') || 0; //初始选择的是第一种颜色

    var _dayBtn = $('.day-btn'),
        _articalCon = $('.artical-con'),
        _lis = $('.set-bg li');

    if (status) {
        light();
    } else {
        night();
    }

    $('.set-bg').on('click', 'li', function() {
        bg = $(this).attr('data-bg');
        index = $(this).index();
        if (status) {
            $('.artical-con').css('background', bg);
        }

        $(this).addClass('active').siblings().removeClass('active');
        storage.set('bg', bg);
        storage.set('index', index);
    })

    $('.day-btn').on('click', function() {
        status = !status;
        if (status) {
            light();
        } else {
            night();
        }

        var tag = status ? '夜间' : '白天';
        storage.set('tag', tag);
    })

    //白天的状态 -----》字显示夜间
    function light() {
        _dayBtn.find('dd').text('夜间');
        _dayBtn.removeClass('light');
        _articalCon.css('background', bg);
        _lis.eq(index).addClass('active').siblings().removeClass('active');
    }

    //晚上的状态 -----》字显示白天
    function night() {
        _dayBtn.find('dd').text('白天');
        _dayBtn.addClass('light');
        _articalCon.css('background', '#0f1410');
        _lis.eq(5).addClass('active').siblings().removeClass('active');
    }

})