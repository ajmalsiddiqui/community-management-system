const bodyParser = require('body-parser');

const router = require('express').Router();

const activityController = require('../controllers/index').activityController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/create', (req, res) => {
    const date = new Date(req.body.date);
    activityController.createNewActivity(req.body.name, req.body.description, req.body.venue, date, req.body.conductedBy, (err, info) => {
        console.log(info);
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.body.conductedBy
        });
        else res.redirect('/activity/get-activity?activityId=' + info.info._id + '&commId=' +req.body.conductedBy);
        /*else res.render('activities-detailed', {
            layout: 'dashboardLayout.hbs',
            name: info.info.name,
            date: info.info.date,
            description: info.info.description,
            venue: info.info.venue,
            commId: req.query.commId,
            activityId: req.query.activityId
        });*/
    });
});


router.get('/get-activity', (req, res) => {
    console.log(req.query);
    activityController.getActivityDetails(req.query.activityId, (err, info) => {
        //all errors and info are returned in JSON format
        console.log(err);
        console.log(info);
        if(err) res.render('error', {
            title: 'CMS',
            status: '400',
            message: err.info.toString(),
            commId: req.query.commId
        });
        // TODO: render details of member
        else res.render('activities-detailed', {
            layout: 'dashboardLayout.hbs',
            name: JSON.parse(info.info).name,
            date: JSON.parse(info.info).date,
            description: JSON.parse(info.info).description,
            venue: JSON.parse(info.info).venue,
            commId: req.query.commId,
            activityId: req.query.activityId
        });
    });
});

router.get('/delete-activity', (req, res) => {
    activityController.deleteActivity(req.query.activityId, (err, info) => {
        if(err) res.render('error', {
            title: 'CMS',
            status: '400',
            message: err.body.toString(),
            commId: req.query.commId
        });
        else res.render('successful', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            message: 'Successfully Removed Activity!',
            commId: req.query.commId
        });
    });
});

router.get('/get-activities', (req, res) => {
    activityController.getActivitiesOfCommunity(req.query.commId, (err, info) => {
        console.log(err);
        console.log(info.info);
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.query.commId
        });
        else res.render('activities', {
            layout: 'dashboardLayout.hbs',
            activities: JSON.parse(info.info),
            title: 'CMS',
            commId: req.query.commId
        });
    });
});

// API routes
router.post('/api/create', (req, res) => {
    const date = new Date(req.body.date);
    activityController.createNewActivity(req.body.name, req.body.description, req.body.venue, date, req.body.conductedBy, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;