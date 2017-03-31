/**
 * VERSION: 0.2.0
 * nodejs-lofter-spider
 * Created on 2017/3/30.~
 * Talk is cheap. Show me the code.
 * GIT:https://github.com/zwj47
 *
 * @author: by zwjtheone, email:zwj@zwj.space
 * ==============================================
 */

//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var async = require('async');
const nodemailer = require('nodemailer');
//目标网址
var url = 'http://idheihei.lofter.com/tag/%E6%80%A7%E6%84%9F?page=';
//本地存储目录
var dir = './lofter';
//发送邮件列表
// const mailList = '474338731@qq.com';
const mailList = '474338731@qq.com,695663959@qq.com,781175929@qq.com,953378666@qq.com,979674967@qq.com,654949619@qq.com';
// //创建目录
mkdirp(dir, function (err) {
	if (err) {
		console.log(err);
	}
});
//抓取頁數
var page = 3;
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
				concurrencyCount = concurrencyCount +=1 ;
				var src = $(this).attr('src');
				var fileName = src.split("/")[4].split('?')[0];
				var dowUrl = src.split('?')[0];
				//console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', dowUrl, '，耗时' + delay + '毫秒');
				//console.log('值', dowUrl + '_' + fileName);
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
				concurrencyCount = concurrencyCount -=1;
				callback(null, imgSrc);
			}, delay);
		}
	});
}, function (err, result) {
	if (err) {
		console.log('1.5 err: ', err);
	}
	console.log('抓取图片完成===================================================================');
	// console.log('results: ', result);
	//下载文件;
	//download(result);
	//发送邮件
	sendMail(result);
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
			console.log('共抓取图片' + result.length + '张');
			// console.log('1.5 results: ', result);
		});
	}
};
//发送邮件
function sendMail(result) {
	let mailContent = '';
	var transporter = nodemailer.createTransport({
		host            : 'smtp.qq.com',
		secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
		port            : 465,
		auth            : {
			user: 'zwjtheone@vip.qq.com',
			pass: 'zxB955519'
		},
	});
	// mailContent需要由读者自行配制，这里对mailContent的赋值已经删去。
	mailContent = formMailContent(result);
	var mailOptions = {
		from   : 'ZWJ <zwjtheone@vip.qq.com>', // sender address
		to     : mailList, // list of receivers
		subject: 'ZWJ-每日美女 ✔', // Subject line
		//text   : mailContent, // plaintext body
		html   : '<b>' + mailContent + '</b>' // html body
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Message sent: ' + info.response);
		}
	});
}
function formMailContent(info) {
	let MailHTML = '';
	let count = 0;
	for (i of info) {
		for (j of i) {
			// console.log(j);
			MailHTML +=
				"<img style='display:block;margin:5px auto;width: 85%' src='" + j + "'>" + "\n"
			count++;
		}
	}
	console.log(MailHTML);
	console.log('共有' + count + '张图片');
	return MailHTML;
}
