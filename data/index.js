var homeData = require('./mock/home.json');

var detailData = require('./mock/352876.json');

var recommend1 = require('./mock/recommend/recommend1.json');
var recommend2 = require('./mock/recommend/recommend2.json');
var recommend3 = require('./mock/recommend/recommend3.json');

var searchHot = require('./mock/search-hot.json');

var searchTian = require('./mock/search-tian.json');

var searchZhu = require('./mock/search-zhu.json');

var female = require('./mock/female.json');

var detail352876 = require('./mock/352876.json');

var chapterList = require('./mock/chapter-list.json');

var artical1 = require('./mock/artical/data1.json');
var artical2 = require('./mock/artical/data2.json');
var artical3 = require('./mock/artical/data3.json');
var artical4 = require('./mock/artical/data4.json');

var objData = {
    '/api/index': homeData,
    '/api/detail': detailData,
    '/api/recommend?pagenum=1': recommend1,
    '/api/recommend?pagenum=2': recommend2,
    '/api/recommend?pagenum=3': recommend3,
    '/api/search-hot': searchHot,
    '/api/search?key=诛仙': searchZhu,
    '/api/search?key=择天记': searchTian,
    '/api/list?type=female': female,
    '/api/detail?fiction_id=352876': detail352876,
    '/api/chapterList?fiction_id=352876': chapterList,
    '/api/artical?fiction_id=352876&chapter_id=1': artical1,
    '/api/artical?fiction_id=352876&chapter_id=2': artical2,
    '/api/artical?fiction_id=352876&chapter_id=3': artical3,
    '/api/artical?fiction_id=352876&chapter_id=4': artical4,
}

module.exports = function(url) {
    // '/api/detail'
    return objData[url]
}