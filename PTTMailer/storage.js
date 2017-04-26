var Firebase = require ('firebase');
var ref = new Firebase('https://ractivemovie123.firebaseio.com/');

// 讀取（寫入）最新一筆文章
var storage = {
	read: function  (callback) {
		ref.once('value', function  (snapshot) {
			var val = snapshot.val();
			callback(val.title, val.link);
		})
	},
	save: function (title, link){
		ref.set({
			title: title,
			link: link
		});
	}
};
// storage.save('[發案] Facebook 貼文被分享，一鍵全部按讚', 'https://www.ptt.cc/bbs/CodeJob/M.1460452528.A.C3A.html');
// storage.read(function(title, link){console.log(title, link);})
module.exports= storage;
