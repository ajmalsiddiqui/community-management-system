const bodyParser = require('body-parser');

const router = require('express').Router();

const activityController = require('../controllers/index').activityController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/create', (req, res) => {
    const date = new Date(req.body.date);
    activityController.createNewActivity(req.body.name, req.body.description, req.body.venue, date, req.body.conductedBy, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;