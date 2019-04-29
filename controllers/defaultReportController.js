const format    = require("../src/format")
const excel     = require('../src/excel')
const fs        = require("fs")
const sql       = require("mssql")
const uuidv4    = require('uuid/v4');

uuidv4(); // ⇨ '10ba038e-48da-487b-96e8-8d3b99b6d18a'

var defaultReportController = {}

const DBConfig = getDBConfig();
// let pool1 = sql.connect(DBConfig);
const pool1 = new sql.ConnectionPool(DBConfig);
const pool1Connect = pool1.connect();
pool1.on('error', err => {
    console.error(err)
})
// console.log(pool1)


const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

//Funcion para obtener la información general de la base de datos
function getDBConfig() {
    const CONFIG_PATH = './config.json' //Path del archivo de configuraciones

    //Se lee el archivo de configuraciones y se convierte a un objeto JSON
    try {
        const configData = fs.readFileSync(CONFIG_PATH);
        var configDataJSON = JSON.parse(configData);
        // console.log(configDataJSON);
    } catch (err) {
        console.log('Hubo un error al leer el archivo de configuraciones. Por favor verificar que esté correcto.')
        return null
    }

    //Se crean las constantes con la información necesaria para iniciar el servidor y conectarse al base de datos
    const PORT = configDataJSON['PORT'] || 8200
    const DB_DATABASE = configDataJSON['DB_Database']
    const DB_USERNAME = configDataJSON['DB_Username']
    const DB_PASSWORD = configDataJSON['DB_Password']
    const DB_HOST = configDataJSON['DB_Host']
    const DB_PORT = configDataJSON['DB_Port']

    // Configuracion necesaria para la base de datos
    var DBConfig = {
        user: DB_USERNAME,
        password: DB_PASSWORD,
        server: DB_HOST,
        database: DB_DATABASE,
        port: DB_PORT
    }

    return DBConfig
}

defaultReportController.byDateByUsers = async function(req, res) {
    await pool1Connect
    try {
        console.log(req.query);
        let body = req.query;
        let query =`SELECT
                dbo.userinfo.badgenumber as "No. de Usuario",
                dbo.userinfo.name as "Nombre",
                dbo.userinfo.lastname as "Apellido",
                dbo.personnel_area.areaname as "Nombre de Dispositivo",
                dbo.departments.DeptName as "Departamento",
                FORMAT(dbo.attshifts.AttDate, 'yyyy-MM-dd') as "Fecha",
                FORMAT(dbo.attshifts.ClockInTime, 'yyyy HH:mm') as "Entrada",
                FORMAT(dbo.attshifts.ClockOutTime, 'yyyy HH:mm') as "Salida",
                FORMAT(dbo.attshifts.StartTime, 'yyyy HH:mm') as "Hora de Entrada",
                FORMAT(dbo.attshifts.EndTime, 'yyyy HH:mm') as "Hora de Salida",
                5 as "Retardo de Entrada",
                5 as "Salida Temprana",
                dbo.attshifts.break_time as "Tiempo de Descanso",
                FORMAT(dbo.attshifts.cacl_break_out, 'yyyy HH:mm') as "Salida a Descanso",
                FORMAT(dbo.attshifts.cacl_break_in, 'yyyy HH:mm') as "Entrada de Descanso",
                dbo.attshifts.break_time_real as "Tiempo Real de Descanso",
                5 as "Retardo de Descanso",
                5 as "Retardo Total",
                dbo.attshifts.Absent as "Ausencia",
                5 as "Marcaje Pendiente de Descanso",
                5 as "Marcaje Pendiente de Salida a Descanso",
                5 as "Marcaje Pendiente de Entrada de Descanso",
                dbo.attshifts.NoIn as "Marcaje Pendiente de Entrada",
                dbo.attshifts.NoOut as "Marcaje Pendiente de Salida",
                dbo.attshifts.OverTime as "T.E. Normal",
                dbo.attshifts.Symbol as "Permiso"
            FROM dbo.attshifts
            JOIN dbo.userinfo ON dbo.userinfo.userid = dbo.attshifts.userid
            JOIN dbo.departments ON dbo.userinfo.defaultdeptid = dbo.departments.DeptID
            JOIN (
                select employee_id, max( area_id) as 'area_id'
                from dbo.userinfo_attarea
                group by employee_id) d1 ON d1.employee_id = dbo.userinfo.userid
            JOIN dbo.personnel_area ON d1.area_id = dbo.personnel_area.id
            WHERE AttDate >= '${body.startDate}' AND AttDate <= '${body.endDate}'
            AND dbo.userinfo.isblacklist IS NULL AND (dbo.attshifts.WorkDay = 1 OR dbo.attshifts.Symbol = 'V')`

        if (body.users) {
            let users = body.users;

            if (users.length > 0) {
                query += `\nAND( dbo.userinfo.userid = ${users[0]}`;

                users.splice(0, 1);

                for (const user of users) {
                    query += ` OR dbo.userinfo.userid = ${user}`
                }

                query += ')'
            }
        }

        // console.log(query)

        const request = new sql.Request(pool1);
    	let result = await request.query(query);
        formattedData = format.parseToFormat(result);

        uuid = uuidv4();
        let excel_path = `./reports/requested/${uuid}.xlsx`;
        excel.parseToExcel(formattedData, excel_path);
        console.log(`Created: ${excel_path}`);

        response = {
            message: 'OK',
            uuid: uuid,
            data: formattedData
        }

        res.send(response)

    } catch (err) {
        // await sql.close()
        console.error(err)
    }
}

defaultReportController.dailyReport = async function() {

    await pool1Connect;
    try {

        // let currentDate = new Date();
        let currentDate = new Date(2018, 10, 10);

        let query = `
            SELECT
                dbo.userinfo.badgenumber as "No. de Usuario",
                dbo.userinfo.name as "Nombre",
                dbo.userinfo.lastname as "Apellido",
                dbo.personnel_area.areaname as "Nombre de Dispositivo",
                dbo.departments.DeptName as "Departamento",
                FORMAT(dbo.attshifts.AttDate, 'yyyy-MM-dd') as "Fecha",
                FORMAT(dbo.attshifts.ClockInTime, 'yyyy HH:mm') as "Entrada",
                FORMAT(dbo.attshifts.ClockOutTime, 'yyyy HH:mm') as "Salida",
                FORMAT(dbo.attshifts.StartTime, 'yyyy HH:mm') as "Hora de Entrada",
                FORMAT(dbo.attshifts.EndTime, 'yyyy HH:mm') as "Hora de Salida",
                5 as "Retardo de Entrada",
                5 as "Salida Temprana",
                dbo.attshifts.break_time as "Tiempo de Descanso",
                FORMAT(dbo.attshifts.cacl_break_out, 'yyyy HH:mm') as "Salida a Descanso",
                FORMAT(dbo.attshifts.cacl_break_in, 'yyyy HH:mm') as "Entrada de Descanso",
                dbo.attshifts.break_time_real as "Tiempo Real de Descanso",
                5 as "Retardo de Descanso",
                5 as "Retardo Total",
                dbo.attshifts.Absent as "Ausencia",
                5 as "Marcaje Pendiente de Descanso",
                5 as "Marcaje Pendiente de Salida a Descanso",
                5 as "Marcaje Pendiente de Entrada de Descanso",
                dbo.attshifts.NoIn as "Marcaje Pendiente de Entrada",
                dbo.attshifts.NoOut as "Marcaje Pendiente de Salida",
                dbo.attshifts.OverTime as "T.E. Normal",
                dbo.attshifts.Symbol as "Permiso"
            FROM dbo.attshifts
            JOIN dbo.userinfo ON dbo.userinfo.userid = dbo.attshifts.userid
            JOIN dbo.departments ON dbo.userinfo.defaultdeptid = dbo.departments.DeptID
            JOIN (
				select employee_id, max( area_id) as 'area_id'
				from dbo.userinfo_attarea
				group by employee_id) d1 ON d1.employee_id = dbo.userinfo.userid
			JOIN dbo.personnel_area ON d1.area_id = dbo.personnel_area.id
            WHERE day(AttDate) = ${currentDate.getDate()} AND month(AttDate) = ${currentDate.getMonth()}
            AND dbo.userinfo.isblacklist IS NULL AND (dbo.attshifts.WorkDay = 1 OR dbo.attshifts.Symbol = 'V')
            `

            // WHERE day(AttDate) = day(GETDATE()) AND month(AttDate) = month(GETDATE())

        const request = await new sql.Request(pool1)
        const result = await request.query(query)
        formattedData = format.parseToFormat(result);


        let excel_path = `./reports/daily/Reporte-${currentDate.getDate()}-${(currentDate.getMonth()+1)}-${currentDate.getFullYear()}.xlsx`;
        excel.parseToExcel(formattedData, excel_path);
        console.log("Daily report created.");

        return excel_path
    } catch (err) {
        console.log(err);
        return null
    }
}

defaultReportController.getUsers = async function(req, res) {

    await pool1Connect;
    try {
        let query = `
            SELECT
                dbo.userinfo.badgenumber as badgenumber,
				dbo.userinfo.lastname + ', ' + dbo.userinfo.name as name,
                dbo.userinfo.name as firstname,
                dbo.userinfo.lastname as lastname,
                dbo.userinfo.userid as id
            FROM dbo.userinfo
            WHERE dbo.userinfo.isblacklist IS NULL
			order by dbo.userinfo.lastname
        `
        console.log('Users requested.')
        const request = await new sql.Request(pool1)
        const result = await request.query(query)

        let users = result.recordset;
        res.send(users)
    } catch (err) {
        console.log(err);
        res.send([])
    }

}

defaultReportController.downloadExcelFromId = function(req, res) {

    console.log(req.query)
    let body = req.query;
    var file = process.cwd() + `\\reports\\requested\\${body.uuid}.xlsx`;

    console.log(`Requested: ${file}`);
    res.download(file);
}

module.exports = defaultReportController
