const http = require("http");
const Promise = require("promise"); //ES6 buit-in object
const cheerio = require("cheerio");
const baseUrl = "http://www.jianshu.com/p/";
const articleIds = ['d05e902af678', 'd05e902af678', '89f1d4245b20'];
const articlePromiseArray = [];
const nodemailer = require('nodemailer');
articleIds.forEach(function (item) {
	articlePromiseArray.push(getPageAsync(baseUrl + item));
});
function getPageAsync(url) {
	return new Promise(function (resolve, reject) {
		http.get(url, function (res) {
			var html = "";
			res.on("data", function (data) {
				html += data;
			});
			res.on("end", function () {
				resolve(html);
			});
		}).on("error", function (e) {
			reject(e);
			console.log("获取信息出错!");
		});
	});
};
Promise.all(articlePromiseArray).then(function onFulfilled(pages) {
	let mailContent = '';
	let infoArray = [];
	pages.forEach(function (html) {
		let info = filterArticles(html);
		infoArray.push(info);
		printInfo(info);
	});
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
	mailContent = formMailContent(infoArray);

	var mailOptions = {
		from   : 'ZWJ <zwjtheone@vip.qq.com>', // sender address
		to     : '474338731@qq.com', // list of receivers
		subject: 'Crawler-jianshu ✔', // Subject line
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
}, function onRejected(e) {
	console.log(e);
});

function formMailContent(info) {
	let MailHTML = '';
	for(i of info){
		console.log(i);
		MailHTML +=
			"-- 【文章题目】" + i.title.replace(/\s+/g, "") + "\n </br>"+
			"   【" + i.title.replace(/\s+/g, "") + "】 发布时间：" + i.publishTime + "\n </br>"+
			"   【" + i.title.replace(/\s+/g, "") + "】 字数总计：" + i.textNum.replace(/\s+/g, "") + "\n"+ "</br>"
	}
	console.log(MailHTML);
	return MailHTML;
}

function filterArticles(html) {
	let $ = cheerio.load(html);
	let title = $(".article .title").text();
	let publishTime = $('.publish-time').text();
	let textNum = $('.wordage').text().split(' ')[1];
	// let views = $('.views-count').text().split('阅读')[1];
	// let commentsNum = $('.comments-count').text();
	// let likeNum = $('.likes-count').text();
	let articleData = {
		title      : title,
		publishTime: publishTime,
		textNum    : textNum
		// views: views,
		// commentsNum: commentsNum,
		// likeNum: likeNum
	};
	return articleData;
};
function printInfo(info) {
	console.log("=========printInfo BEGIN=========" + "\n");
	let title = info.title;
	let publishTime = info.publishTime;
	let textNum = info.textNum;
	console.log("-- 【文章题目】" + title.replace(/\s+/g, "") + "\n");
	console.log("   【" + title.replace(/\s+/g, "") + "】 发布时间：" + publishTime + "\n");
	console.log("   【" + title.replace(/\s+/g, "") + "】 字数总计：" + textNum.replace(/\s+/g, "") + "\n");
	console.log("=========printInfo DONE=========");
	console.log("\n");
}
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
