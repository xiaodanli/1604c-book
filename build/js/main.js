require.config({
    baseUrl: '/js/',
    paths: {
        //库文件
        'jquery': './libs/jquery-2.1.1.min',
        'swiper': './libs/swiper.min',
        'bscroll': './libs/bscroll',
        'handlebars': './libs/handlebars-v4.0.11',
        'text': './libs/text',
        'lazyload': './libs/jquery.lazyload',
        'base64': './libs/jquery.base64',

        //页面js
        'index': './app/index',
        'search': './app/search',
        'list': './app/list',
        'detail': './app/detail',
        'chapterList': './app/chapter-list',
        'login': './app/login',
        'artical': './app/artical',

        //common
        'GetSlideDirection': './common/direction',
        'render': './common/render',
        'storage': './common/storage',
        'getRequest': './common/getRequest',

        //模板
        'bookTB': '../page/tpl/book-t-b.html',
        'bookLR': '../page/tpl/book-l-r-list.html',
        'indexTpl': '../page/tpl/index-tpl.html',
        'searchTpl': '../page/tpl/book-l-r-s-list.html',
        'listTpl': '../page/tpl/list.html',
        'detailTpl': '../page/tpl/detail-tpl.html'
    },
    shim: {
        'lazyload': {
            deps: ['jquery']
        },
        'base64': {
            deps: ['jquery']
        }
    }
})