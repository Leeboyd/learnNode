var request = require('request');
var cheerio = require('cheerio');

// 抓取最新（最底）的文章
function fetch(callback){
	var url = "https://www.ptt.cc/bbs/CodeJob/index.html";
	request(url, function (error, response, body) {
	$ = cheerio.load(body);
	var title = $('.r-list-sep').prev().find('.title a').text();
	var link = 'https://www.ptt.cc' + $('.r-list-sep').prev().find('.title a').attr('href');
	callback(title, link);
	})
}

fetch(function(title, link){
	console.log('文章標題： '+title+'\n文章連結： '+link);
});

module.exports = fetch;
