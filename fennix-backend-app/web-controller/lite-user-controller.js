var express = require('express');
const LiteUser = require('../repository-module/models/lite-user-model')
var router = express.Router();


router.get("/liteTickets", (req, res) => {
    LiteUser.find(req.body, (err, data) => {
        if(err){
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
        return;
    });
});

router.post("ticket", (req, res) => {
    LiteUser.save( (err, data) => {
        if(err){
            res.status(500).send(err);
            return;
        }
        res.status(200).send(data);
        return;
    });
});



module.exports = router;