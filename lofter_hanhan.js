/**
 * VERSION: 1.0.0
 * nodejs-lofter-spider
 * Created on 2017/3/31.~
 * Talk is cheap. Show me the code.
 * GIT:https://github.com/zwj47
 *
 * @author: by zwjtheone, email:zwj@zwj.space
 * ==============================================
 */
'use strict';
let fs = require("fs");
let cheerio = require('cheerio');
let async = require("async");
let request = require('superagent');
let nodemailer = require('nodemailer');
require('superagent-charset')(request);
const Config = {
	startPage         : 1, //开始页码
	endPage           : 1, //结束页码，不能大于当前图片类型总页码
	downloadImg       : false, //是否下载图片到硬盘,否则只保存Json信息到文件
	sendImg           : true,
	downloadConcurrent: 10, //下载图片最大并发数
	currentImgType    : "scy" //当前程序要爬取得图片类型,取下面AllImgType的Key。
};
//总的图片数组
let imangeUrlList = [];
//邮件内容
let mailContent = '';
//邮件列表
const mailList = '474338731@qq.com,695663959@qq.com,781175929@qq.com,953378666@qq.com,979674967@qq.com,654949619@qq.com';
const AllImgType = { //网站的图片类型
	ecy   : "http://tu.hanhande.com/ecy/ecy_", //二次元   总页码: 50
	scy   : "http://tu.hanhande.com/scy/scy_", //三次元   总页码: 64
	cos   : "http://tu.hanhande.com/cos/cos_", //cosPlay 总页码: 20
	lofter: 'http://idheihei.lofter.com/tag/%E6%80%A7%E6%84%9F?page='
};
let getHtmlAsync = function (url) {
	return new Promise(function (resolve, reject) {
		request.get(url).charset('gbk').end(function (err, res) {
			err ? reject(err) : resolve(cheerio.load(res.text));
		});
	});
}
let getAlbumsAsync = function () {
	return new Promise(function (resolve, reject) {
			console.log('Start get albums .....');
			let albums = [];
			let q = async.queue(async function (url, taskDone) {
				try {
					let $ = await getHtmlAsync(url);
					console.log(`download ${url} success`);
					$('.picList em a').each(function (idx, element) {
						albums.push({
							title  : element.children[1].attribs.alt,
							url    : element.attribs.href,
							imgList: []
						});
					});
				} catch (err) {
					console.log(`Error : get Album list - download ${url} err : ${err}`);
				}
				finally {
					taskDone();// 一次任务结束
				}
			}, 10);//html下载并发数设为10
			/**
			 * 监听：当所有任务都执行完以后，将调用该函数
			 */
			q.drain = function () {
				console.log('Get album list complete');
				resolve(albums);//返回所有画册
			}
			let pageUrls = [];
			let imageTypeUrl = AllImgType[Config.currentImgType];
			for (let i = Config.startPage; i <= Config.endPage; i++) {
				pageUrls.push(imageTypeUrl + `${i}.shtml`);
			}
			q.push(pageUrls);
		}
	);
}
let getImageListAsync = function (albumsList) {
	return new Promise(function (resolve, reject) {
		console.log('Start get album`s imgList ....');
		let q = async.queue(async function ({url: albumUrl, title: albumTitle, imgList}, taskDone) {
			try {
				let $ = await getHtmlAsync(albumUrl);
				console.log(`get album ${albumTitle} image list done`);
				$('#picLists img').each(function (idx, element) {
					imgList.push(element.attribs.src);
				});
			} catch (err) {
				console.log(`Error :get image list - download ${albumUrl} err : ${err}`);
			}
			finally {
				taskDone();// 一次任务结束
			}
		}, 10);//html下载并发数设为10
		/**
		 * 监听：当所有任务都执行完以后，将调用该函数
		 */
		q.drain = function () {
			console.log('Get image list complete');
			resolve(albumsList);
		}
		//将所有任务加入队列
		q.push(albumsList);
	});
}
//---------------------------------------------------------------------------lofter
let getLofterHtmlAsync = function (url) {
	return new Promise(function (resolve, reject) {
		request.get(url).end(function (err, res) {
			err ? reject(err) : resolve(cheerio.load(res.text));
		});
	});
};
let getLofterAlbumsAsync = function () {
	return new Promise(function (resolve, reject) {
			console.log('Start get albums .....');
			let albums = [];
			let q = async.queue(async function (url, taskDone) {
				try {
					let $ = await getLofterHtmlAsync(url);
					console.log(`download ${url} success`);
					$('.img a').each(function (idx, element) {
						albums.push({
							url    : element.attribs.href,
							imgList: []
						});
					});
				} catch (err) {
					console.log(`Error : get Album list - download ${url} err : ${err}`);
				}
				finally {
					taskDone();// 一次任务结束
				}
			}, 10);//html下载并发数设为10
			/**
			 * 监听：当所有任务都执行完以后，将调用该函数
			 */
			q.drain = function () {
				console.log('Get album list complete');
				resolve(albums);//返回所有画册
			};
			let pageUrls = [];
			let imageTypeUrl = AllImgType.lofter;
			for (let i = Config.startPage; i <= Config.endPage; i++) {
				pageUrls.push(imageTypeUrl + `${i}`);
			}
			q.push(pageUrls);
		}
	);
}
let getLofterImageListAsync = function (albumsList) {
	return new Promise(function (resolve, reject) {
		console.log('Start get album`s imgList ....');
		let q = async.queue(async function ({url: albumUrl, imgList}, taskDone) {
			try {
				let $ = await getLofterHtmlAsync(albumUrl);
				console.log(`get album image list done`);
				$('.imgclasstag img').each(function (idx, element) {
					imgList.push(element.attribs.src);
				});
			} catch (err) {
				console.log(`Error :get image list - download ${albumUrl} err : ${err}`);
			}
			finally {
				taskDone();// 一次任务结束
			}
		}, 10);//html下载并发数设为10
		/**
		 * 监听：当所有任务都执行完以后，将调用该函数
		 */
		q.drain = function () {
			console.log('Get image list complete');
			resolve(albumsList);
		}
		//将所有任务加入队列
		q.push(albumsList);
	});
};
//---------------------------------------------------------------------------
function writeJsonToFile(albumList) {
	let folder = `json-${Config.currentImgType}-${Config.startPage}-${Config.endPage}`
	fs.mkdirSync(folder);
	let filePath = `./${folder}/${Config.currentImgType}-${Config.startPage}-${Config.endPage}.json`;
	fs.writeFileSync(filePath, JSON.stringify(albumList));
	let simpleAlbums = [];
	// "http://www.hanhande.com/upload/170103/4182591_102225_1063.jpg"
	const slice = "http://www.hanhande.com/upload/".length;//所有图片URL的公共部分
	albumList.forEach(function ({title: albumTitle, url: albumUrl, imgList}) {
		let imgListTemp = [];
		imgList.forEach(function (url) {
			imgListTemp.push(url.slice(slice));//去掉所有图片URL的公共部分
		})
		simpleAlbums.push({title: albumTitle, url: albumUrl, imgList: imgListTemp})
	});
	filePath = `./${folder}/${Config.currentImgType}-${Config.startPage}-${Config.endPage}.min.json`;
	fs.writeFileSync(filePath, JSON.stringify(simpleAlbums));
}
function downloadImg(albumList) {
	console.log('Start download album`s image ....');
	const folder = `img-${Config.currentImgType}-${Config.startPage}-${Config.endPage}`;
	// fs.mkdirSync(folder);
	let downloadCount = 0;
	let q = async.queue(async function ({title: albumTile, url: imageUrl}, taskDone) {
		request.get(imageUrl).end(function (err, res) {
			if (err) {
				console.log(err);
				taskDone();
			} else {
				fs.writeFile(`./${folder}/${albumTile}-${++downloadCount}.jpg`, res.body, function (err) {
					err ? console.log(err) : console.log(`${albumTile}保存一张`);
					taskDone();
				});
			}
		});
	}, Config.downloadConcurrent);
	/**
	 * 监听：当所有任务都执行完以后，将调用该函数
	 */
	q.drain = function () {
		console.log('All img download');
	};
	let imgListTemp = [];
	albumList.forEach(function ({title, imgList}) {
		imgList.forEach(function (url) {
			imgListTemp.push({title: title, url: url});
		});
	});
	q.push(imgListTemp);//将所有任务加入队列
}
function sendImg(albumList, lofterAlbumList) {
	let q = async.queue(async function ({title: albumTile, url: imageUrl}, taskDone) {
		console.log(imageUrl)
		imangeUrlList.push(imageUrl);
		taskDone();
	}, Config.downloadConcurrent);
	/**
	 * 监听：当所有任务都执行完以后，将调用该函数
	 */
	q.drain = function () {
		console.log('All img download');
		sendMail();
	};
	let imgListTemp = hebing(albumList, lofterAlbumList);
	q.push(imgListTemp);//将所有任务加入队列
}
function hebing(one, two) {
	let imgListTemp = [];
	one.forEach(function ({title, imgList, orUrl}, index) {
		imgList.forEach(function (url) {
			imgListTemp.push({title: title, url: url});
		});
	});
	two.forEach(function ({title, imgList, orUrl}, index) {
		imgList.forEach(function (url) {
			imgListTemp.push({title: title, url: url});
		});
	});
	return imgListTemp;
}
function sendMail() {
	let transporter = nodemailer.createTransport({
		host            : 'smtp.qq.com',
		secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
		port            : 465,
		auth            : {
			user: 'zwjtheone@vip.qq.com',
			pass: 'zxB955519'
		},
	});
	console.log(imangeUrlList.length)
	let mailContent = formMailContent(imangeUrlList);
	// console.log(mailContent.split('!')[1]);
	let mailOptions = {
		from   : 'ZWJ <zwjtheone@vip.qq.com>', // sender address
		to     : mailList, // list of receivers
		subject: 'ZWJ-每日美女--共有' + mailContent.split('!')[1] + '张', // Subject line
		//text   : mailContent, // plaintext body
		html   : '<b>' + mailContent.split('!')[0] + '</b>' // html body
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
	info.forEach(function (item) {
		MailHTML +=
			"<a href='" + item + "'><img style='display:block;margin:5px auto;width: 85%' src='" + item + "'></a>" + "\n"
		count++;
	});
	console.log(MailHTML);
	console.log('共有' + count + '张图片');
	return MailHTML + '!' + count;
}
async function spiderRun() {
	//爬取hanhan
	let albumList = await getAlbumsAsync();//获取所有画册URL
	albumList = await getImageListAsync(albumList);//根据画册URL获取画册里的所有图片URL
	//爬取lofter
	let lofterAlbumList = await getLofterAlbumsAsync();//获取所有画册URL
	lofterAlbumList = await getLofterImageListAsync(lofterAlbumList);//根据画册URL获取画册里的所有图片URL
	// console.log(lofterAlbumList);
	//writeJsonToFile(albumList);//将画册信息保存为JSON
	if (Config.downloadImg) {
		//downloadImg(albumList);//下载画册里面的所有图片
	}
	if (Config.sendImg) {
		sendImg(albumList, lofterAlbumList)
	}
}
spiderRun();
