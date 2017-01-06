var http = require('http');      // http 网路
var cheerio = require('cheerio');  // html 解析
var fs = require("fs");        // 流
// 设置被查询的目标网址
var queryHref = "http://idheihei.lofter.com/?page=";
// 设置分页位置
var querySearch = 1;
var urls = [];
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var deleteRepeat = {};
/**
 * 根据url和参数获取分页内容
 * @param {String}： url
 * @param {int}： serach
 */

function getHtml(href, serach) {
	var pageData = "";
	var hrf = href + serach + '&t=1483620175118';
	console.log(hrf)
	var req = http.get(hrf, function (res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			pageData += chunk;
		});
		res.on('end', function () {
			$ = cheerio.load(pageData);
			var html = $('.block img');
			for (var i = 0; i < html.length; i++) {
				// var src = html[i].attribs.src;
				// // 筛选部分广告，不是真的段子
				// if (src.indexOf("http://image.haha.mx") > -1) {
				urls.push(html[i].attribs.src)
				// }
			}
			if (serach == pagemax) {
				console.log("图片链接获取完毕！" + urls.length);
				console.log("链接总数量：" + urls.length);
				// urls.forEach(function (imgUrl) {
				// 	console.log(imgUrl)
				downImg(urls)
				// })
			}
		});
	});
}
/**
 * 下载图片
 * @param {String} imgurl：图片地址
 */
var index = 0;
function downImg(imgurl) {
	console.log(imgurl[index])
	if (imgurl[index] == undefined) {
		console.log("跳过");
		index++;
		console.log(index);
		downImg(imgurl);
		return;
	}
	var narr = imgurl[index].split("/")[4].split('?')[0];
	var urlArray = imgurl[index].split("/");
	var dowUrl = urlArray[0] + '/' + urlArray[1] + '/' + urlArray[2] + '/' + urlArray[3] + '/' + urlArray[4].split('?')[0];
	// console.log(dowUrl);
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
					console.log("下载完毕");
					index++;
					console.log(index);
					downImg(imgurl);
				}
			});
		});
	});
}
var pagemax = 20;    // 获取10页的内容
function start() {
	console.log("开始获取图片连接");
	for (var i = 1; i <= pagemax; i++) {
		getHtml(queryHref, i);
	}
}
start();
// 判断作者是否重复
function isRepeat(authorName) {
	if (deleteRepeat[authorName] == undefined) {
		deleteRepeat[authorName] = 1;
		console.log('不存在')
		return false;
	} else if (deleteRepeat[authorName] == 1) {
		console.log('存在')
		return true;
	}
}
