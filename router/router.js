const express = require('express')
const router = express.Router()
const defaultReportController = require('../controllers/defaultReportController')
const emailController = require('../controllers/emailController')

router.get('/', function(req, res) {res.send("welcome")});

router.get('/byDateByUsers', defaultReportController.byDateByUsers)
router.get('/getUsers', defaultReportController.getUsers)

router.get('/getEmails', emailController.getUsers)
router.post('/addEmail', emailController.addUser)
router.delete('/deleteEmail', emailController.deleteUser)

module.exports = router;
