const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hkexperiment786@gmail.com',
        pass: 'bswfvtnmtxauttya'
    }
});

module.exports = transporter;