// var async = require('async');
// var concurrencyCount = 0;
// var fetchUrl = function (url, callback) {
// 	var delay = parseInt((Math.random() * 10000000) % 2000, 10);
// 	concurrencyCount++;
// 	console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
// 	setTimeout(function () {
// 		concurrencyCount--;
// 		callback(null, url + ' html content');
// 	}, delay);
// };
// var urls = [];
// for (var i = 0; i < 30; i++) {
// 	urls.push('http://datasource_' + i);
// }
// async.mapLimit(urls, 5, function (url, callback) {
// 	fetchUrl(url, callback);
// }, function (err, result) {
// 	console.log('final:');
// 	console.log(result);
// });
var ddd = [['http://imglf0.nosdn.127.net/img/anA5K0szZ3JKNFB1YkZraExQNGdDRWJPajFleUYvZk9HaDNISVErb0JiSHJpMkJtU3RKc1lRPT0.jpg_anA5K0szZ3JKNFB1YkZraExQNGdDRWJPajFleUYvZk9HaDNISVErb0JiSHJpMkJtU3RKc1lRPT0.jpg',
	'http://imglf0.nosdn.127.net/img/anA5K0szZ3JKNFBuMkcyRlRBdGh1SVZxMVI5QkJONHNCUDhEMG9KNytFZ0tXV0RLY2FCaEl3PT0.jpg_anA5K0szZ3JKNFBuMkcyRlRBdGh1SVZxMVI5QkJONHNCUDhEMG9KNytFZ0tXV0RLY2FCaEl3PT0.jpg',
	'http://imglf2.nosdn.127.net/img/anA5K0szZ3JKNE5kZGxXU2xGYjNCSUR4TVl2QnRCeGlRRE1ncTllSDVFUVp1WFZIbGpqNS9RPT0.jpg_anA5K0szZ3JKNE5kZGxXU2xGYjNCSUR4TVl2QnRCeGlRRE1ncTllSDVFUVp1WFZIbGpqNS9RPT0.jpg',
	'http://imglf2.nosdn.127.net/img/anA5K0szZ3JKNE5iWDR4UkVuTVMyMENUMG10WUpESUs5ZUFVV09ZMElMRFRRWHpkSlZnR25BPT0.jpg_anA5K0szZ3JKNE5iWDR4UkVuTVMyMENUMG10WUpESUs5ZUFVV09ZMElMRFRRWHpkSlZnR25BPT0.jpg',
	'http://imglf0.nosdn.127.net/img/anA5K0szZ3JKNE5iWDR4UkVuTVMyOFhFdWduc1JTRVZsV2w0dmU4WC9LekM3RjRLZVF0THZnPT0.jpg_anA5K0szZ3JKNE5iWDR4UkVuTVMyOFhFdWduc1JTRVZsV2w0dmU4WC9LekM3RjRLZVF0THZnPT0.jpg',
	'http://imglf1.nosdn.127.net/img/U0JJdGZZRW55T3R1UVhsY2V2NEJoaWJzZi9MZzhlZ2dKSzF5eTY1anR4bmt4b0xib2JiZ3ZRPT0.jpg_U0JJdGZZRW55T3R1UVhsY2V2NEJoaWJzZi9MZzhlZ2dKSzF5eTY1anR4bmt4b0xib2JiZ3ZRPT0.jpg',
	'http://imglf.nosdn.127.net/img/U0JJdGZZRW55T3R1UVhsY2V2NEJodSt4R3BtWGc3STVNUFJ6QzNQZ083MG5rZ1E1c0NpV2ZnPT0.jpg_U0JJdGZZRW55T3R1UVhsY2V2NEJodSt4R3BtWGc3STVNUFJ6QzNQZ083MG5rZ1E1c0NpV2ZnPT0.jpg',
	'http://imglf.nosdn.127.net/img/U0JJdGZZRW55T3R1UVhsY2V2NEJodjQ3ak0xVXlXSnVwaDArTzl4ZEpzZHZ0alZ4MzdYK1ZBPT0.jpg_U0JJdGZZRW55T3R1UVhsY2V2NEJodjQ3ak0xVXlXSnVwaDArTzl4ZEpzZHZ0alZ4MzdYK1ZBPT0.jpg',
	'http://imglf0.nosdn.127.net/img/U0JJdGZZRW55T3R1UVhsY2V2NEJoZ0xZSk53UnBDKzBNbVdiSm1XQWtobVAxZldTdXlQZ2ZRPT0.jpg_U0JJdGZZRW55T3R1UVhsY2V2NEJoZ0xZSk53UnBDKzBNbVdiSm1XQWtobVAxZldTdXlQZ2ZRPT0.jpg',
	'http://imglf.nosdn.127.net/img/dGJ1Z2Z3ZFFJdnIzeTBOOWhjOUJORDJpKzFCQk1XTEVpUTlTU2kzRGhCckhWTHl3RUxFSjJRPT0.jpg_dGJ1Z2Z3ZFFJdnIzeTBOOWhjOUJORDJpKzFCQk1XTEVpUTlTU2kzRGhCckhWTHl3RUxFSjJRPT0.jpg'],
	['http://imglf0.nosdn.127.net/img/WHpCTzN4M0dsMzZPbzQvcFRETnBLNndUb3YxcnduMTVuakZabDdJc3FOemExamFYY2VxTG9BPT0.jpg_WHpCTzN4M0dsMzZPbzQvcFRETnBLNndUb3YxcnduMTVuakZabDdJc3FOemExamFYY2VxTG9BPT0.jpg',
		'http://imglf1.nosdn.127.net/img/eExtQjZkbVJDTHRJMnFnSktUMllvenltWjhXR1ljZUZqSzk0amhrQWRHS3BvbWtrbHdOanNRPT0.jpg_eExtQjZkbVJDTHRJMnFnSktUMllvenltWjhXR1ljZUZqSzk0amhrQWRHS3BvbWtrbHdOanNRPT0.jpg',
		'http://imglf2.nosdn.127.net/img/eExtQjZkbVJDTHZSbjc0L2hBbDIxeHptUEcza2ZmTkFGVlRodThFaENXa2F5dEFCQXg5dmtBPT0.jpg_eExtQjZkbVJDTHZSbjc0L2hBbDIxeHptUEcza2ZmTkFGVlRodThFaENXa2F5dEFCQXg5dmtBPT0.jpg',
		'http://imglf0.nosdn.127.net/img/eExtQjZkbVJDTHRiSEUxejJLSEVaR25mRmFBRzQxUk1Ra0xQTTdjLytLeTgzRys2MG1qTkF3PT0.jpg_eExtQjZkbVJDTHRiSEUxejJLSEVaR25mRmFBRzQxUk1Ra0xQTTdjLytLeTgzRys2MG1qTkF3PT0.jpg',
		'http://imglf0.nosdn.127.net/img/anA5K0szZ3JKNE5PNHpUYWNjdnFLakNZRnBpRTcwV1haeEJibFYxbEM5T0RKeEJpZTJrNmtnPT0.jpg_anA5K0szZ3JKNE5PNHpUYWNjdnFLakNZRnBpRTcwV1haeEJibFYxbEM5T0RKeEJpZTJrNmtnPT0.jpg',
		'http://imglf0.nosdn.127.net/img/U0JJdGZZRW55T3RoRzlQUWIzRXVqUDcyWWNzb1Z5UGtYdzlXQlFQUmdXWVY4MUdHb1dBMk1BPT0.jpg_U0JJdGZZRW55T3RoRzlQUWIzRXVqUDcyWWNzb1Z5UGtYdzlXQlFQUmdXWVY4MUdHb1dBMk1BPT0.jpg',
		'http://imglf1.nosdn.127.net/img/U0JJdGZZRW55T3NVY0pnUldmTjFkeTc1dkJaV3V3bXNRQnBGRnpudE1VN3Q3TGFjRzljZGZnPT0.jpg_U0JJdGZZRW55T3NVY0pnUldmTjFkeTc1dkJaV3V3bXNRQnBGRnpudE1VN3Q3TGFjRzljZGZnPT0.jpg',
		'http://imglf2.nosdn.127.net/img/U0JJdGZZRW55T3NVY0pnUldmTjFkMDdCVTFyblZOdHRYdWVtbjQyUXlOaHJaVExYQ011Q0JnPT0.jpg_U0JJdGZZRW55T3NVY0pnUldmTjFkMDdCVTFyblZOdHRYdWVtbjQyUXlOaHJaVExYQ011Q0JnPT0.jpg',
		'http://imglf0.nosdn.127.net/img/U0JJdGZZRW55T3NVY0pnUldmTjFkNDJ2dFo0VW1lYmVTNTVXK01YS1BuTkNHdGp0R3JURlhnPT0.jpg_U0JJdGZZRW55T3NVY0pnUldmTjFkNDJ2dFo0VW1lYmVTNTVXK01YS1BuTkNHdGp0R3JURlhnPT0.jpg',
		'http://imglf1.nosdn.127.net/img/a282TGQ2eDRlVFdLb3oyOGtYNmVpNngzZUNETXRvVk9CL1REbXNUSWZhb21rb2FzR2ZmVi93PT0.jpg_a282TGQ2eDRlVFdLb3oyOGtYNmVpNngzZUNETXRvVk9CL1REbXNUSWZhb21rb2FzR2ZmVi93PT0.jpg']]

for (var i = 0; i <= ddd.length; i++) {
	console.log(ddd[i])
}
