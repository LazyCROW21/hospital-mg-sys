require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const router = require('./routes/index');
const ejs = require('ejs');
const path = require('path');

const app = express()

app.use(cors());
app.use(express.json());
app.use('/api', router);

app.get('/', async (req, res) => {
    res.send(
        await ejs.renderFile(
            path.join(__dirname, './helper/email-template/report.ejs'),
            {
                title: 'Report',
                report: {
                    doctor: {
                        user: {
                            firstName: 'Hardik',
                            lastName: 'Kardam',
                            phone: '1233211231'
                        }
                    },
                    patient: {
                        user: {
                            firstName: 'Yash',
                            lastName: 'Kardam',
                            phone: '1233211231'
                        }
                    },
                    appointment: {
                        subject: 'Testing me',
                        message: 'You are the best',
                        preferredDateTime: new Date(),
                        status: 'rejected',
                        rejectMessage: null,
                        concludedByPatient: true,
                        concludedByDoctor: true
                    },
                    status: 're-check'
                },
            }
        )
    );
});

const port = process.env.PORT | 4000;

try {
    sequelize.authenticate().then(() => {
        console.log('Connected to DB');
    });
} catch (error) {
    console.error('DB connection error:', error);
}

app.listen(port, () => {
    console.log('Server running at port:', port);
})