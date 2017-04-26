'use strict'
const nodemailer = require('nodemailer')
let pass = ''
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'friend6702@gmail.com',
        pass: ''
    }
});
const mailer = function(title, link) {
    transporter.sendMail({
        from: 'friend6702@gmail.com',
        to: 're.linkx@gmail.com',
        subject: 'Hello, Incomming Jobs',
        // text: 'Hello world ',
        html: title + '<br><a href="' + link + '">' + link + '</a>'
    }, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
// mailer('test', 'erere');
module.exports = mailer
