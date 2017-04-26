var fetch = require('./fetch');
var storage = require('./storage');
var mailer = require('./mailer');
var schedule = require('./schedule');

schedule(function(){
	fetch(function  (currentTitle, currentLink) {
		storage.read(function(lastTitle, lastLink){
			if(lastTitle != currentTitle){
				console.log('new Post');
				storage.save(currentTitle, currentLink);
				mailer(currentTitle, currentLink);
			}else{
				console.log('no Post');
			}
		});

	})
});
