/**
 * VERSION: 0.2.0
 * pachong
 * Created on 2017/1/6.嘻嘻嘻~
 * GIT:https://github.com/zwj47
 *
 * @author: by Jay99, email:zwj@zwj.space
 * ==============================================
 */
var pageNum = 10;	//要爬取文章的页数
var pageUrls = [];
var infoArray = [];
var index = 0, dowNum = 0;
for (var i = 1; i <= pageNum; i++) {
	pageUrls.push('http://idheihei.lofter.com/?page=' + i + '&t=1483620175118');
}
var superagent = require("superagent"),
	cheerio    = require("cheerio"),
	async      = require("async"),
	eventproxy = require('eventproxy');
fs = require('fs');
http = require('http');
var ep = new eventproxy();
function onRequest(req, res) {
	// 设置字符编码(去掉中文会乱码)
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
	pageUrls.forEach(function (pageUrl) {
		// res.write(pageUrl + '<br/>');
		// console.log(pageUrl)
		superagent.get(pageUrl)
		.end(function (err, ares) {
			if (err) {
				console.log(err);
				return;
			}
			var $      = cheerio.load(ares.text),
				imgEle = $('.block .main .content .img a img'),
				len    = imgEle.length;
			for (var i = 0; i < imgEle.length; i++) {
				infoArray.push(imgEle.eq(i).attr('src'));
				// res.write(imgEle.eq(i).attr('src') + '<br/>');
			}
			index++;
			console.log(index)
			if (index == pageNum) {
				console.log('图片总数' + infoArray.length);
				infoArray.forEach(function (imgUrl) {
					downImg(imgUrl, res)
				})
			}
		});
	})
}
function downImg(imgurl, res) {
	var narr = imgurl.split("/")[4].split('?')[0];
	var urlArray = imgurl.split("/");
	var dowUrl = urlArray[0] + '/' + urlArray[1] + '/' + urlArray[2] + '/' + urlArray[3] + '/' + urlArray[4].split('?')[0];
	res.write(dowUrl + '<br/>');
	http.get(dowUrl, function (ress) {
		var imgData = "";
		//一定要设置response的编码为binary否则会下载下来的图片打不开
		ress.setEncoding("binary");
		ress.on("data", function (chunk) {
			imgData += chunk;
		});
		ress.on("end", function () {
			var savePath = "./lofter/" + narr;
			fs.writeFile(savePath, imgData, "binary", function (err) {
				if (err) {
					console.log(err);
				} else {
					dowNum++;
					console.log(dowNum);
					console.log("下载完毕");
				}
			});
		});
		if (dowNum == infoArray.length) {
			res.end();
		}
	});
}
http.createServer(onRequest).listen(3000);
