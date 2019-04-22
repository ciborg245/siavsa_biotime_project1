const express = require('express')
const router = express.Router()
const defaultReportController = require('../controllers/defaultReport')

router.get('/', function(req, res) {res.send("welcome")});

router.get('/byDateByUsers', defaultReportController.byDateByUsers)
router.get('/getUsers', defaultReportController.getUsers)

module.exports = router;
