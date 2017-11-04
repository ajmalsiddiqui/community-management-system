const bodyParser = require('body-parser');

const router = require('express').Router();

const eventController = require('../controllers/index').eventController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/create', (req, res) => {
    const date = new Date(req.body.date);
    eventController.createNewEvent(req.body.name, req.body.description, req.body.venue, date, parseInt(req.body.budget), req.body.conductedBy, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;