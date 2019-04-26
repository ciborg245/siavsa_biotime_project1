const fs        = require("fs")

const EMAILS_PATH = './data/emails.json'

var emailController = {}

emailController.getUsers = function(req, res) {
    fs.readFile(EMAILS_PATH, (err, data) => {
        if (err) {
            console.error(err)
            res.send({message: 'ERROR'})
        }

        var dataJSON = JSON.parse(data);

        console.log('GET/emails')

        res.send(dataJSON)
    })
}

emailController.addUser = function(req, res) {
    fs.readFile(EMAILS_PATH, (err, data) => {
        if (err) {
            console.error(err)
            res.send({message: 'ERROR'})
        }

        newEmail = req.body.email;

        var dataJSON = JSON.parse(data);
        if (dataJSON.emails.includes(newEmail)) {
            console.log("Asdfasdfasd")
            res.send({message: "El email ya está registrado."})
            return
        }
        dataJSON.emails.push(newEmail)
        fs.writeFile(EMAILS_PATH, JSON.stringify(dataJSON), (err, data) => {
            if (err) {
                console.error(err)
                res.send({message: 'ERROR'})
            }
            console.log(`Se ha agregado el email ${newEmail}`)
            res.send({message: 'OK'})
        })
    })
}

emailController.deleteUser = function(req, res) {
    fs.readFile(EMAILS_PATH, (err, data) => {
        if (err) {
            console.error(err)
            res.send({err})
        }

        delEmail = req.query.email;

        var dataJSON = JSON.parse(data);

        var emailIndex = dataJSON.emails.indexOf(delEmail);
        if (emailIndex < 0) {
            res.send({message: 'No existe registro de ese Email.'})
        } else {
            dataJSON.emails.splice(emailIndex, 1)

            fs.writeFile(EMAILS_PATH, JSON.stringify(dataJSON), (err, data) => {
                if (err) {
                    console.error(err)
                    res.send({message: 'ERROR'})
                }
                console.log(`Se ha borrado el email ${delEmail}`)
                res.send({message: 'OK'})
            })
        }
    })
}

module.exports = emailController
