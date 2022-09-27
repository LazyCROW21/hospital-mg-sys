const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });
const MAIL_PWD = process.env.MAIL_PWD;
const MAIL_ADDR = process.env.MAIL_ADDR;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_ADDR,
        pass: MAIL_PWD
    }
});

module.exports = transporter;