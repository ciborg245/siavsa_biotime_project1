const cron      = require('node-cron')
// const queries   = require('./queries')
const queries   = require('../controllers/defaultReportController')
const nodemailer = require('nodemailer')
const fs        = require('fs')
const crypto    = require('crypto')

const INFO_PATH = './data/info.ke'
const EMAILS_PATH = './data/emails.json'

//Se decodifica informacion sensible
try {
    const info = fs.readFileSync(INFO_PATH, "utf8");
    const decipher = crypto.createDecipher('aes192', 'crunchy');
    var pass = decipher.update(info, 'hex', 'utf8');
    pass += decipher.final('utf8');
} catch (err) {
    console.log(err)
    console.log('Hubo un error al leer el archivo de informacion. Por favor verificar que esté correcto.')
}

//Se crean los atributos necesarios para el envio de email
let transport = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: 'siavsa.reports@gmail.com',
            pass: pass
        },
    },
    {
        from: '"Siavsa Report" <siavsa.reports@gmail.com'
    }
)

module.exports = ScheduleReport;

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

// let mailOptions = {
//     to: 'alejandrochgu@gmail.com',
//     subject: "Reporte diario de Biotime",
//     text: "Reporte diario de Biotime.",
//     html: "<HTML>Reporte diario de Biotime.</HTML>",
//     attachments: [
//         {
//             path: ""
//         }
//     ]
// }

async function sendMail(to, path) {
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
            console.log("Report created.");
            fs.readFile(EMAILS_PATH, (err, data) => {
                var emails = JSON.parse(data).emails;
                for (const email of emails) {
                    console.log(email)
                    // sendMail(email, path)
                }
            })
        }).catch(err => {
            console.log(err)
        })
    // })
}

ScheduleReport.prototype.destroyTask = function() {
    if (this.task != null) this.task.destroy()
}
