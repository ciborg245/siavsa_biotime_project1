const express = require('express')
const router = express.Router()
const defaultReportController = require('../controllers/defaultReportController')
const emailController = require('../controllers/emailController')
const reportEmailController = require('../controllers/reportEmailController')

router.get('/', function(req, res) {res.send("welcome")});

router.get('/byDateByUsers', defaultReportController.byDateByUsers)
router.get('/getUsers', defaultReportController.getUsers)
router.get('/downloadExcelFromId', defaultReportController.downloadExcelFromId)

router.get('/getEmails', emailController.getUsers)
router.post('/addEmail', emailController.addUser)
router.delete('/deleteEmail', emailController.deleteUser)

router.get('/reportEmail/getInfo', reportEmailController.getInfo)
router.post('/reportEmail/changeInfo', reportEmailController.changeInfo)


module.exports = router;
