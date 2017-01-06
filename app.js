var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');
var cnodeUrl = 'http://zwjay.cn';
var concurrencyCount = 0;
var ep = new eventproxy();
var topicUrls = [];
superagent.get(cnodeUrl)
.end(function (err, res) {
	if (err) {
		return console.error(err);
	}
	var $ = cheerio.load(res.text);
	$('.post-preview a').each(function (idx, element) {
		var $element = $(element);
		var href = cnodeUrl + $element.attr('href');
		topicUrls.push(href);
	});
	superagent.get(cnodeUrl + '/page2/')
	.end(function (err, res) {
		if (err) {
			return console.error(err);
		}
		var topicUrls = [];
		var $ = cheerio.load(res.text);
		$('.post-preview a').each(function (idx, element) {
			var $element = $(element);
			var href = cnodeUrl + $element.attr('href');
			topicUrls.push(href);
		});
		// topicUrls.forEach(function (topicUrl) {
		// 	superagent.get(topicUrl)
		// 	.end(function (err, res) {
		// 		console.log('fetch ' + topicUrl + ' successful');
		// 		ep.emit('topic_html', [topicUrl, res.text]);
		// 	});
		// });
		ep.after('topic_html', topicUrls.length, function (topics) {
			topics = topics.map(function (topicPair) {
				var topicUrl = topicPair[0];
				var topicHtml = topicPair[1];
				var $ = cheerio.load(topicHtml);
				return ({
					title: $('.post-heading h1').text().trim(),
					href : topicUrl,
					// comment1: $('.reply_content').eq(0).text().trim(),
				});
			});
			console.log('final::::');
			console.log(topics);
		});
		async.mapLimit(topicUrls, 3, function (url, callback) {
			fetchUrl(url, callback);
		}, function (err, result) {
			console.log('final:');
			// console.log(result);
		});
	});
	// topicUrls.forEach(function (topicUrl) {
	// 	superagent.get(topicUrl)
	// 	.end(function (err, res) {
	// 		console.log('fetch ' + topicUrl + ' successful');
	// 		ep.emit('topic_html', [topicUrl, res.text]);
	// 	});
	// });
});
var fetchUrl = function (url, callback) {
	console.log('，正在抓取的是', url);
	superagent.get(url)
	.end(function (err, res) {
		console.log('fetch ' + url + ' successful');
		if (err) {
			console.log(err);
		} else {
			callback(null, [url, res.text]);
			ep.emit('topic_html', [url, res.text]);
		}
	});
};
