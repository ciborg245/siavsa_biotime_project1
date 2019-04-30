/*

*/

// Se exportan las librerías necesarias
const express   = require('express')
const fs        = require("fs")
const crypto    = require("crypto")
const cors      = require('cors')
const routes    = require('../router/router')
const bodyParser = require('body-parser');
var sql         = require("mssql")

var app         = express()
const ScheduleReport = require('../src/schedule_report')


// **** CONFIGURACIONES INICIALES ***
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('./dist/', {index: 'index.html'}))



const CONFIG_PATH = './config.json' //Path del archivo de configuraciones
const SCHEDULE_PATH = './data/schedule.json'

//Se lee el archivo de configuraciones y se convierte a un objeto JSON
try {
    const configData = fs.readFileSync(CONFIG_PATH);
    var configDataJSON = JSON.parse(configData);
    // console.log(configDataJSON);
} catch (err) {
    console.log('Hubo un error al leer el archivo de configuraciones. Por favor verificar que esté correcto.')
    console.log(err)
}

//Se crean las constantes con la información necesaria para iniciar el servidor y conectarse al base de datos
const PORT = configDataJSON['PORT'] || 8200

try {
    const scheduleData = fs.readFileSync(SCHEDULE_PATH);
    var scheduleDataJSON = JSON.parse(scheduleData);
    // console.log(scheduleDataJSON);
} catch (err) {
    console.log('Hubo un error al leer el archivo del horario. Por favor verificar que esté correcto.')
    console.log(err)
}

var SCHEDULE_HOUR = scheduleDataJSON['hour'];
var SCHEDULE_MINUTE = scheduleDataJSON['minute'];


// Se crea la tarea del reporte diario
scheduleReport = new ScheduleReport();
// scheduleReport.newSchedule(SCHEDULE_HOUR, SCHEDULE_MINUTE);
scheduleReport.newSchedule(23, 57);


//Se aplican las rutas
app.use('/api', routes);


//Se levanta el servidor
var server = app.listen(PORT, function () {
    console.log('Server is running...');
});
