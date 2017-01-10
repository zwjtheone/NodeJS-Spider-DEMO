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
mkdirp(dir, function (err) {
	if (err) {
		console.log(err);
	}
});
//抓取頁數
var page = 10;
var urls = [];
for (var i = 1; i <= page; i++) {
	urls.push(url + i);
}
console.log('爬取的链接有' + urls);
var concurrencyCount = 0;
async.mapLimit(urls, 2, function (url, callback) {
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var imgSrc = [];
			var delay = Number;
			var $ = cheerio.load(body);
			$('.img img').each(function (index, value) {
				delay = parseInt((Math.random() * 10000000) % 2000, 10);
				concurrencyCount++;
				var src = $(this).attr('src');
				var fileName = src.split("/")[4].split('?')[0];
				var dowUrl = src.split('?')[0];
				console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', dowUrl, '，耗时' + delay + '毫秒');
				console.log('值', dowUrl + '_' + fileName);
				imgSrc.push(dowUrl);
				// if(page<=1){
				// 	download(src.split('?')[0], dir, narr).then(function () {
				// 		// console.log('下载完成');
				// 		page++;
				//
				// 		getImg();
				// 	});
				// }
			});
			setTimeout(function () {
				concurrencyCount--;
				callback(null, imgSrc);
			}, delay);
		}
	});
}, function (err, result) {
	if (err) {
		console.log('1.5 err: ', err);
	}
	console.log('抓取图片完成===================================================================');
	console.log('1.5 results: ', result);
	//下载文件;
	download(result);
});
//下载方法
var dowconcurrencyCount = 0;
var download = function (theImgUrl) {
	for (var i = 0; i < theImgUrl.length; i++) {
		async.mapLimit(theImgUrl[i], 1, function (url, callback) {
			// var promise = new Promise(function (resolve, reject) {
			var delay = Number;
			request.head(url, function (err, res, body) {
				delay = parseInt((Math.random() * 10000000) % 2000, 10);
				dowconcurrencyCount++;
				request(url).on('error', function (err) {
					console.log(err);
					// reject();
				}).pipe(fs.createWriteStream(dir + '/' + url.split('/')[4]));
				console.log('现在正在下载', url.split('/')[4], '，耗时' + delay + '毫秒');
				// resolve();
				setTimeout(function () {
					dowconcurrencyCount--;
					callback(null, url.split('/')[4]);
				}, delay);
			});
			// });
			// return promise;
		}, function (err, result) {
			if (err) {
				console.log('1.5 err: ', err);
			}
			console.log('抓取图片完成===================================================================');
			console.log('共抓取图片'+result.length+'张');
			// console.log('1.5 results: ', result);
		});
	}
};




