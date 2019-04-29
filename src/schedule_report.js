const cron      = require('node-cron')
const queries   = require('../controllers/defaultReportController')
const nodemailer = require('nodemailer')
const fs        = require('fs')
const crypto    = require('crypto')

const INFO_PATH = './data/info.json'
const EMAILS_PATH = './data/emails.json'
const RRC_PATH = './reports/requested'

module.exports = ScheduleReport;

function createTransport(email, pass) {
    return nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: email,
            pass: pass
        },
    }, {
        from: `"Siavsa Report" <${email}>`
    })
}

function createMailInfo(to) {
    return {
        to: to,
        subject: "Reporte diario de Biotime",
        text: "Reporte diario de Biotime.",
        html: "<HTML>Reporte diario de Biotime.</HTML>",
        attachments: [
            {
                path: ""
            }
        ]
    }
}

async function sendMail(transport, to, path) {
    try {
        let mailOptions = createMailInfo(to);
        mailOptions.attachments[0].path = path;

        mailResponse = await transport.sendMail(mailOptions);
        console.log(mailResponse)
    } catch (err) {
        console.error(err)
    }
}

//Se crea la clase ScheduleReport que tiene el objetivo de realizar una tarea calendarizada
function ScheduleReport() {
    this.task = null;
}

//Se crea la tarea calendarizada en donde se envia el email con el reporte a la hora deseada
ScheduleReport.prototype.newSchedule = function(hour, minute) {
    this.destroyTask();

    this.hour = hour;
    this.minute = minute;

    // this.task = cron.schedule(`${this.minute} ${this.hour} * * *`, () => {
    // this.task = cron.schedule('*/30 * * * * *', () => {
        queries.dailyReport().then(path => {
            fs.readFile(INFO_PATH, (err, data) => {
                if (err) throw err;

                var dataJSON = JSON.parse(data);

                const decipher = crypto.createDecipher('aes192', 'crunchy');
                var pass = decipher.update(dataJSON.password, 'hex', 'utf8');
                pass += decipher.final('utf8');


                var transport = createTransport(dataJSON.email, pass)

                fs.readFile(EMAILS_PATH, (err, data) => {
                    var emails = JSON.parse(data).emails;
                    for (const email of emails) {
                        console.log(email)
                        // sendMail(transport, email, path)
                    }
                })
            })
        }).catch(err => {
            console.log(err)
        })
    // })

    deleteTask = cron.schedule(`55 23 * * *`, () => {
        fs.readdir(RRC_PATH, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(RRC_PATH + `/${file}`, err => {
                  if (err) throw err;
                  console.log(`DELETED ${file}`)
                });
            }
        });
    })
}

ScheduleReport.prototype.destroyTask = function() {
    if (this.task != null) this.task.destroy()
}
