var format = {};

function numToHour(num) {
    return `${Math.trunc(num / 60)}:` + ("0" + Math.trunc(num % 60)).slice(-2)
}

//Funcion para formatear los datos de la DB para el reporte
format.parseToFormat = function(query) {
    res = []
    const  keys = Object.keys(query.recordset[0]);

    for (i in query.recordset) {
        let elem = {};
        var exTime = 0;
        var leTime = 0;

        for (const key of keys){

            var entry = query.recordset[i][key];

            switch (key) {
                case "Entrada":
                case "Salida":
                case "Hora de Entrada":
                case "Hora de Salida":
                case "Salida a Descanso":
                case "Entrada de Descanso":
                    if (parseInt(entry.substr(0,4)) < 2000) {
                        elem[key] = ""
                    } else {
                        elem[key] = entry.substr(5, entry.length)
                    }
                    break;
                case "Retardo de Entrada":
                    let defCheckin = elem["Entrada"];
                    let realCheckin = elem["Hora de Entrada"];
                    if (realCheckin != "" && defCheckin != "") {
                        let defaultDate = new Date(`February 10, 2000 ${parseInt(defCheckin.substr(0,2))}:${defCheckin.substr(3,defCheckin.length)}:00`);
                        let realDate = new Date(`February 10, 2000 ${parseInt(realCheckin.substr(0,2))}:${realCheckin.substr(3,realCheckin.length)}:00`);
                        let diff = (realDate.getTime() - defaultDate.getTime()) / 60000;

                        if (diff > 0) {
                            elem[key] = numToHour(diff);
                            elem.isCheckinLate = true;
                            leTime += diff;
                        } else {
                            elem[key] = "-";
                            elem.isCheckinLate = false;
                            exTime += Math.abs(diff);
                        }
                    } else {
                        elem[key] = "-";
                        elem.isCheckinLate = false
                    }
                    break;
                case "Salida Temprana":
                    let defCheckout = elem["Salida"];
                    let realCheckout = elem["Hora de Salida"];
                    if (realCheckout != "" && defCheckout != "") {
                        let defaultDate = new Date(`February 10, 2000 ${parseInt(defCheckout.substr(0,2))}:${defCheckout.substr(3,defCheckout.length)}:00`);
                        let realDate = new Date(`February 10, 2000 ${parseInt(realCheckout.substr(0,2))}:${realCheckout.substr(3,realCheckout.length)}:00`);
                        let diff = (defaultDate.getTime() - realDate.getTime()) / 60000;

                        if (diff > 0) {
                            elem[key] = numToHour(diff);
                            elem.isCheckoutEarly = true;
                            leTime += diff;
                        } else {
                            elem[key] = "-";
                            elem.isCheckoutEarly = false;
                            exTime += Math.abs(diff);
                        }
                    } else {
                        elem[key] = "-";
                        elem.isCheckoutEarly = false
                    }
                    break;
                case "Retardo de Descanso":
                    if (elem["Tiempo de Descanso"] != 0) {
                        if (elem["Salida a Descanso"] == "" || elem["Entrada de Descanso"] == "") {
                            elem["Marcaje Pendiente de Descanso"] = "Si";
                            elem[key] = "-";
                            elem.isBreakLate = false;
                        } else {
                            if (elem["Tiempo Real de Descanso"] == 0) {
                                elem[key] = "-";
                                elem.isBreakLate = false;
                            } else {
                                let diff = elem["Tiempo Real de Descanso"] - elem["Tiempo de Descanso"];
                                if (diff > 0) {
                                    elem[key] = numToHour(diff);
                                    elem.isBreakLate = true;
                                    leTime += diff;
                                } else {
                                    elem[key] = "-";
                                    elem.isBreakLate = false;
                                    exTime += Math.abs(diff);
                                }
                            }
                        }
                    } else {
                        elem[key] = "-";
                        elem.isBreakLate = false;
                    }

                    elem["Tiempo de Descanso"] = numToHour(elem["Tiempo de Descanso"]);
                    elem["Tiempo Real de Descanso"] = numToHour(elem["Tiempo Real de Descanso"]);
                    break;
                case "Retardo Total":
                    elem[key] = leTime == 0 ? "-" : numToHour(leTime);
                    break;
                // case "T.E. Normal":
                //     let totalExtra = exTime - leTime;
                //     elem[key] = totalExtra > 0 ? totalExtra : 0;
                //     break;
                case "Marcaje Pendiente de Descanso":
                    if (!elem.hasOwnProperty(key)) {
                        elem[key] = ""
                    }
                    break;
                case "Marcaje Pendiente de Entrada":
                case "Marcaje Pendiente de Salida":
                    elem[key] = entry == 1 ? "Si" : ""
                    break;
                case "Ausencia":
                    if (entry > 0) {
                        elem[key] = "Si"
                    } else {
                        elem[key] = ""
                    }
                    break;
                case "Permiso":
                    elem[key] = entry.toUpperCase() == "V" ? "Si" : ""
                    break;
                default:
                    elem[key] = entry
            }
        }

        res.push(elem)
    }

    return res
}

module.exports = format;
