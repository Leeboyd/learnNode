var CronJob = require('cron').CronJob;
var cron = function(job){
	new CronJob('0 */30 * * * *', function(){
		job();
	}, null, true);
}
// cron(function(){
// 	console.log('123')
// })
module.exports = cron;
