const bodyParser = require('body-parser');

const router = require('express').Router();

const sponsorController = require('../controllers/index').sponsorController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

// TODO: get rid of this and add a proper sponsor system
// POST request to create a sponsor and associate it with a community
router.post('/createSponsorFromCommunity', (req, res) => {
    sponsorController.createNewSponsor(req.body.name, (err, info) => {
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.body.community
        });
        else {
            //console.log(JSON.parse(info.info)._id);
            //console.log(JSON.parse(info.info)._id);
            console.log(req.query);
            sponsorController.sponsorCommunity(JSON.parse(info.info)._id, req.body.community, parseInt(req.body.amount), (err, info1) => {
                //console.log(info1.info);
                //console.log(err);
                if(err) res.render('error', {
                    layout: 'dashboardLayout.hbs',
                    title: 'CMS',
                    status: '400',
                    message: err.message.toString(),
                    commId: req.body.community
                });
                else res.redirect('/sponsor/sponsorDetails?sponsorId=' + info1.info._id + '&commId=' + req.body.community);
                /*else res.render('sponsor-detailed', {
                    layout: 'dashboardLayout.hbs',
                    name: info1.info.name,
                    sponsorId: info1.info.sponsorId,
                    commId: req.query.commId
                });*/
                // Render success response/detailed sponsor
            });
        }
    });
});

router.get('/sponsorList', (req, res) => {
    sponsorController.getSponsorsOfCommunity(req.query.commId, (err, info) => {
        //console.log(JSON.parse(info.info));
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.query.commId
        });
        // TODO: render sponsor list
        else res.render('sponsors-comm', {
            layout: 'dashboardLayout.hbs',
            sponsors: JSON.parse(info.info),
            commId: req.query.commId
        });
    });
});

router.get('/sponsorDetails', (req, res) => {
    sponsorController.getSponsorDetails(req.query.sponsorId, (err, info) => {
        console.log(info);
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.query.commId
        });
        // TODO: render sponsor details
        else res.render('sponsor-detailed', {
            layout: 'dashboardLayout.hbs',
            name: info.info.name,
            amount: info.info.amount,
            sponsorId: info.info._id,
            commId: req.query.commId
        });
    });
});

router.get('/deleteSponsor', (req, res) => {
    sponsorController.deleteSponsor(req.query.sponsorId, (err, info) => {
        console.log(err);
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.query.commId
        });
        else res.redirect('/sponsor/sponsorList?commId='+req.query.commId);
    });
});
// API Routes
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