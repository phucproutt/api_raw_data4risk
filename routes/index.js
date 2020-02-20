const express = require('express');
const router  = express.Router();

router.get('/', function(req, res){
    res.json({ message: "Api for raw alerts" });
});

module.exports = router;