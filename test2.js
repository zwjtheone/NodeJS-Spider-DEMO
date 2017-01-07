/**
 * VERSION: 0.2.0
 * pachong
 * Created on 2017/1/6.嘻嘻嘻~
 * GIT:https://github.com/zwj47
 *
 * @author: by Jay99, email:zwj@zwj.space
 * ==============================================
 */

//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
//目标网址
var url = 'http://idheihei.lofter.com/tag/%E6%80%A7%E6%84%9F?page=';
//本地存储目录
var dir = './lofter';
// //创建目录
mkdirp(dir, function(err) {
	if(err){
		console.log(err);
	}
});
//抓取頁數
var page = 6;

var urls = [];
for (var i = 1; i < page; i++) {
	urls.push(url + i);
}
console.log(urls)

async.mapLimit(urls, 2, function (url, callback) {
	console.log(url)
	getImg(url, callback);
}, function (err, result) {
	log('1.5 err: ', err);
	log('1.5 results: ', result);
});
var concurrencyCount = 0;

function getImg(urll, callback) {
	request(urll, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			$('.img img').each(function () {
				var src = $(this).attr('src');
				// console.log('正在下载' + src);
				var fileName = src.split("/")[4].split('?')[0];
				var dowUrl = src.split('?')[0];
				// console.log(dowUrl + '#' +fileName);


				var delay = parseInt((Math.random() * 10000000) % 2000, 10);
				concurrencyCount++;
				console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', urll, '，耗时' + delay + '毫秒');
				setTimeout(function () {
					concurrencyCount--;
					callback(null, dowUrl + '#' +fileName);
				}, delay);


				// if(page<=1){
				// 	download(src.split('?')[0], dir, narr).then(function () {
				// 		// console.log('下载完成');
				// 		page++;
				//
				// 		getImg();
				// 	});
				// }
			});
		}
	});
}


//下载方法
var download = function (url, dir, filename) {
	var promise = new Promise(function (resolve, reject) {
		request.head(url, function (err, res, body) {
			request(url).on('error', function (err) {
				console.log(err);
				reject();
			}).pipe(fs.createWriteStream(dir +'/'+ filename));
			resolve();
		});
	});
	return promise;
};
