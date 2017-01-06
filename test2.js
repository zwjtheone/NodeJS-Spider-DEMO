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
//目标网址
var url = 'http://idheihei.lofter.com/tag/%E6%80%A7%E6%84%9F?page=';
//本地存储目录
var dir = './images';
// //创建目录
// mkdirp(dir, function(err) {
// 	if(err){
// 		console.log(err);
// 	}
// });
//发送请求
var page = 1;
getImg();
function getImg() {
	request(url + page, function (error, response, body) {
		console.log(body)
		console.log(error)
		console.log(response)
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			$('.img img').each(function () {
				var src = $(this).attr('src');
				// console.log('正在下载' + src);
				var narr = src.split("/")[4].split('?')[0];
				download(src, dir, narr).then(function () {
					// console.log('下载完成');
					page++;
					getImg();
				});
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
			}).pipe(fs.createWriteStream(dir + filename));
			resolve();
			// request('url', function (error, response, body) {
			// 	if (!error && response.statusCode == 200) {
			// 		fs.writeFile(dir, body, "binary", function (err) {
			// 			if (err) {
			// 				console.log(err);
			// 			} else {
			// 				console.log("下载完毕");
			// 				resolve();
			// 			}
			// 		});
			// 	}
			// })
		});
	});
	return promise;
};
