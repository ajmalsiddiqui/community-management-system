const bodyParser = require('body-parser');

const router = require('express').Router();

const sponsorController = require('../controllers/index').sponsorController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/create', (req, res) => {
    sponsorController.createNewSponsor(req.body.name, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

router.get('/sponsor-community', (req, res) => {
    sponsorController.sponsorCommunity(req.query.sponsorId, req.query.communityId, parseInt(req.query.amount), (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;