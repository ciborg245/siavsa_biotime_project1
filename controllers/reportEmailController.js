const fs        = require('fs')
const crypto    = require('crypto')

const INFO_PATH = './data/info.json'

reportEmailController = {}

reportEmailController.getInfo = function(req, res) {
    fs.readFile(INFO_PATH, (err, data) => {
        if (err) {
            console.error(err)
            res.send({message: 'ERROR'})
        }

        var dataJSON = JSON.parse(data)

        console.log('GET/info')

        const decipher = crypto.createDecipher('aes192', 'crunchy');
        var pass = decipher.update(dataJSON.password, 'hex', 'utf8');
        pass += decipher.final('utf8');

        let response = dataJSON
        response.password = pass

        console.log(pass)

        res.send({
            message: 'OK',
            data: response
        })
    })

}

reportEmailController.changeInfo = function(req, res) {
    fs.readFile(INFO_PATH, (err, data) => {
        if (err) {
            console.error(err)
            res.send({message: 'ERROR'})
        }

        var dataJSON = JSON.parse(data)

        console.log('POST/info')

        let body = req.body

        // **** CONFIGURACIONES INICIALES ****
        secret = "siavsabiotime"
        const cipher = crypto.createCipher('aes192', 'crunchy');
        var encrypted = cipher.update(body.password, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // console.log(encrypted);

        dataJSON.password = encrypted

        fs.writeFile(INFO_PATH, JSON.stringify(dataJSON), (err, data) => {
            if (err) {
                console.error(err)
                res.send({message: 'ERROR'})
            }

            console.log(dataJSON)
            console.log('Se ha modificado el correo de reportes.')
            res.send({message: 'OK'})

        })

        // console.log(dataJSON)
        //
        // res.send({
        //     message: 'OK'
        // })
    })
}

module.exports = reportEmailController
