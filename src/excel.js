const xl = require('excel4node')

var excel = {};

const titleStyle = {
    alignment : {
        horizontal: 'center',
        wrapText: true
    },
    font : {
        color: "#000000",
        bold: true,
        size: 12,
        name: 'Arial'
    }
}

const normalStyle = {
    alignment : {
        horizontal: 'center',
    },
    font : {
        color: "#000000",
        bold: true,
        size: 11,
        name: 'Arial'
    }
}

const highlightStyle = {
    alignment : {
        horizontal: 'center',
    },
    font : {
        color: "FF0000",
        size: 11,
        bold: true,
        name: 'Arial'
    }
}

const generalKeys = [
    "No. de Usuario",
    "Nombre",
    "Apellido",
    "Nombre de Dispositivo",
    "Departamento",
    "Fecha",
    "Entrada",
    "Salida",
    "Hora de Entrada",
    "Hora de Salida",
    "Retardo de Entrada",
    "Salida Temprana",
    "Tiempo de Descanso",
    "Salida a Descanso",
    "Entrada de Descanso",
    "Tiempo Real de Descanso",
    "Retardo de Descanso",
    "Retardo Total",
    "Ausencia",
    // "Marcaje Pendiente de Descanso",
    "Marcaje Pendiente de Salida a Descanso",
    "Marcaje Pendiente de Entrada de Descanso",
    "Marcaje Pendiente de Entrada",
    "Marcaje Pendiente de Salida",
    "T.E. Normal",
    "Permiso"
]

const ausenciasKeys = [
    "No. de Usuario",
    "Nombre",
    "Apellido",
    "Nombre de Dispositivo",
    "Departamento",
    "Fecha",
    "Ausencia"
]

const tempranaKeys = [
    "No. de Usuario",
    "Nombre",
    "Apellido",
    "Nombre de Dispositivo",
    "Departamento",
    "Fecha",
    "Salida",
    "Hora de Salida",
    "Salida Temprana"
]

const extrasKeys = [
    "No. de Usuario",
    "Nombre",
    "Apellido",
    "Nombre de Dispositivo",
    "Departamento",
    "Fecha",
    "T.E. Normal"
]

const permisosKeys = [
    "No. de Usuario",
    "Nombre",
    "Apellido",
    "Nombre de Dispositivo",
    "Departamento",
    "Fecha",
    "Permiso"
]

const retardosKeys = [
    "No. de Usuario",
    "Nombre",
    "Apellido",
    "Nombre de Dispositivo",
    "Departamento",
    "Fecha",
    "Entrada",
    "Hora de Entrada",
    "Retardo de Entrada",
    "Salida a Descanso",
    "Entrada de Descanso",
    "Retardo de Descanso",
    "Retardo Total"
]

const titleWidths = {
    "No. de Usuario" : 15,
    "Nombre" : 22,
    "Apellido" : 25,
    "Nombre de Dispositivo" : 20,
    "Departamento" : 20,
    "Fecha": 16,
    "Entrada" : 12,
    "Salida" : 12,
    "Hora de Entrada": 12,
    "Hora de Salida": 12,
    "Retardo de Entrada" : 15,
    "Salida Temprana": 15,
    "Tiempo de Descanso": 12,
    "Salida a Descanso": 12,
    "Entrada de Descanso": 12,
    "Tiempo Real de Descanso": 15,
    "Retardo de Descanso": 15,
    "Retardo Total": 12,
    "Ausencia" : 12,
    // "Marcaje Pendiente de Descanso": 20,
    "Marcaje Pendiente de Salida a Descanso": 25,
    "Marcaje Pendiente de Entrada de Descanso": 25,
    "Marcaje Pendiente de Entrada": 20,
    "Marcaje Pendiente de Salida": 20,
    "T.E. Normal": 12,
    "Permiso": 12
}

excel.parseToExcel = function(data) {
    var wb = new xl.Workbook();

    let sheets = [];

    var wsGeneral = wb.addWorksheet('Reporte General');
    var wsAusencias = wb.addWorksheet('Ausencias');
    var wsTemprana = wb.addWorksheet('Salidas Tempranas');
    var wsExtras = wb.addWorksheet('Horas Extras');
    var wsPermisos = wb.addWorksheet('Permisos');
    var wsRetardos = wb.addWorksheet('Retardos');

    wsGeneral.row(1).setHeight(35);
    wsGeneral.row(1).freeze();
    wsAusencias.row(1).setHeight(35);
    wsAusencias.row(1).freeze();
    wsTemprana.row(1).setHeight(35);
    wsTemprana.row(1).freeze();
    wsExtras.row(1).setHeight(35);
    wsExtras.row(1).freeze();
    wsPermisos.row(1).setHeight(35);
    wsPermisos.row(1).freeze();
    wsRetardos.row(1).setHeight(35);
    wsRetardos.row(1).freeze();

    for (let i = 0; i < generalKeys.length; i++) {
        wsGeneral.column(i + 1).setWidth(titleWidths[generalKeys[i]]);
        wsGeneral.cell(1, i + 1)
            .string(generalKeys[i])
            .style(titleStyle)

        let temp = ausenciasKeys.indexOf(generalKeys[i])
        if (temp > -1) {
            wsAusencias.column(temp + 1).setWidth(titleWidths[ausenciasKeys[temp]]);
            wsAusencias.cell(1, temp + 1)
                .string(generalKeys[i])
                .style(titleStyle)
        }

        temp = tempranaKeys.indexOf(generalKeys[i])
        if (temp > -1) {
            wsTemprana.column(temp + 1).setWidth(titleWidths[tempranaKeys[temp]]);
            wsTemprana.cell(1, temp + 1)
                .string(generalKeys[i])
                .style(titleStyle)
        }

        temp = extrasKeys.indexOf(generalKeys[i])
        if (temp > -1) {
            wsExtras.column(temp + 1).setWidth(titleWidths[extrasKeys[temp]]);
            wsExtras.cell(1, temp + 1)
                .string(generalKeys[i])
                .style(titleStyle)
        }

        temp = permisosKeys.indexOf(generalKeys[i])
        if (temp > -1) {
            wsPermisos.column(temp + 1).setWidth(titleWidths[permisosKeys[temp]]);
            wsPermisos.cell(1, temp + 1)
                .string(generalKeys[i])
                .style(titleStyle)
        }

        temp = retardosKeys.indexOf(generalKeys[i])
        if (temp > -1) {
            wsRetardos.column(temp + 1).setWidth(titleWidths[retardosKeys[temp]]);
            wsRetardos.cell(1, temp + 1)
                .string(generalKeys[i])
                .style(titleStyle)
        }
    }

    let ausenciaCont = 2;
    let tempranaCont = 2;
    let extrasCont = 2;
    let permisosCont = 2;
    let retardosCont = 2;

    var style;

    for (let i = 0; i < data.length; i++) {

        for (let j = 0; j < generalKeys.length; j++) {

            let cellData = data[i][generalKeys[j]];

            if (typeof cellData == 'number') {
                style = normalStyle;

                wsGeneral.cell(i + 2, j + 1)
                    .number(cellData)
                    .style(normalStyle)

                if (data[i]["Ausencia"] == "Si") {
                    temp = ausenciasKeys.indexOf(generalKeys[j]);

                    if (temp > -1) {
                        wsAusencias.cell(ausenciaCont, temp + 1)
                            .number(cellData)
                            .style(style)
                    }
                }

                if (data[i].isCheckoutEarly) {
                    temp = tempranaKeys.indexOf(generalKeys[j]);
                    if (temp > -1) {
                        wsTemprana.cell(tempranaCont, temp + 1)
                            .number(cellData)
                            .style(style)
                    }
                }

                if (data[i]["T.E. Normal"] > 0) {
                    temp = extrasKeys.indexOf(generalKeys[j])
                    if (temp > -1) {
                        wsExtras.cell(extrasCont, temp + 1)
                            .number(cellData)
                            .style(style)
                    }
                }

                if (data[i]["Permiso"] == "Si") {
                    temp = permisosKeys.indexOf(generalKeys[j])
                    if (temp > -1) {
                        wsPermisos.cell(permisosCont, temp + 1)
                            .number(cellData)
                            .style(style)
                    }
                }

                if (data[i].isCheckinLate || data[i].isBreakLate) {
                    temp = retardosKeys.indexOf(generalKeys[j])
                    if (temp > -1) {
                        wsRetardos.cell(retardosCont, temp + 1)
                            .number(cellData)
                            .style(style)
                    }
                }
            } else {
                style = normalStyle;

                if (generalKeys[j] == "Hora de Entrada") {
                    if (data[i].isCheckinLate) {
                        style = highlightStyle;
                    }
                } else if (generalKeys[j] == "Hora de Salida") {
                    if (data[i].isCheckoutEarly) {
                        style = highlightStyle;
                    }
                } else if (generalKeys[j] == "Entrada de Descanso") {
                    if (data[i].isBreakLate) {
                        style = highlightStyle;
                    }
                }

                wsGeneral.cell(i + 2, j + 1)
                    .string(cellData)
                    .style(style)

                if (data[i]["Ausencia"] == "Si") {
                    temp = ausenciasKeys.indexOf(generalKeys[j]);

                    if (temp > -1) {
                        wsAusencias.cell(ausenciaCont, temp + 1)
                            .string(cellData)
                            .style(style)
                    }
                }

                if (data[i].isCheckoutEarly) {
                    temp = tempranaKeys.indexOf(generalKeys[j]);
                    if (temp > -1) {
                        wsTemprana.cell(tempranaCont, temp + 1)
                            .string(cellData)
                            .style(style)
                    }
                }

                if (data[i]["T.E. Normal"] > 0) {
                    temp = extrasKeys.indexOf(generalKeys[j])
                    if (temp > -1) {
                        wsExtras.cell(extrasCont, temp + 1)
                            .string(cellData)
                            .style(style)
                    }
                }

                if (data[i]["Permiso"] == "Si") {
                    temp = permisosKeys.indexOf(generalKeys[j])
                    if (temp > -1) {
                        wsPermisos.cell(permisosCont, temp + 1)
                            .string(cellData)
                            .style(style)
                    }
                }

                if (data[i].isCheckinLate || data[i].isBreakLate) {
                    temp = retardosKeys.indexOf(generalKeys[j])
                    if (temp > -1) {
                        wsRetardos.cell(retardosCont, temp + 1)
                            .string(cellData)
                            .style(style)
                    }
                }
            }
        }

        if (data[i]["Ausencia"] == "Si")
            ausenciaCont++;
        if (data[i].isCheckoutEarly)
            tempranaCont++;
        if (data[i]["T.E. Normal"] > 0)
            extrasCont++;
        if (data[i]["Permiso"] == "Si")
            permisosCont++;
        if (data[i].isCheckinLate || data[i].isBreakLate)
            retardosCont++;
    }

    var today = new Date();
    let excel_path = `./reports/Report-${today.getDate()}-${(today.getMonth()+1)}-${today.getFullYear()}.xlsx`;
    // try {
        wb.write(excel_path)
        return excel_path
    // } catch (err) {
    //     console.log(err)
    //     return null
    // }
}

module.exports = excel;
