const bodyParser = require('body-parser');

const router = require('express').Router();

const eventController = require('../controllers/index').eventController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/create', (req, res) => {
    const date = new Date(req.body.date);
    eventController.createNewEvent(req.body.name, req.body.description, req.body.venue, date, req.body.budget, req.body.conductedBy, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.body.commId
        });
        else res.redirect('/event/get-event?eventId=' + JSON.parse(info.info)._id + '&commId=' +req.body.conductedBy);
        /*else res.render('event-detailed', {
            layout: 'dashboardLayout.hbs',
            name: JSON.parse(info.info).name,
            date: JSON.parse(info.info).date,
            description: JSON.parse(info.info).description,
            venue: JSON.parse(info.info).venue,
            budget: JSON.parse(info.info).budget,
            commId: req.query.commId,
            eventId: req.query.eventId
        });*/
    });
});

router.get('/all', (req, res) => {
    eventController.getAllEvents((err, info) => {
        if(err) res.render('error', {
            //layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString()
        });
        else res.render('events', {
            //layout: 'dashboardLayout.hbs',
            events: JSON.parse(info.info),
            title: 'CMS'
            //commId: req.query.commId
        });
    });
});

router.get('/get-events', (req, res) => {
    eventController.getEventsOfCommunity(req.query.commId, (err, info) => {
        //console.log(info.info);
        if(err) res.render('error', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.body.commId
        });
        else res.render('events', {
            layout: 'dashboardLayout.hbs',
            events: JSON.parse(info.info),
            title: 'CMS',
            commId: req.query.commId
        });
    });
});

router.get('/get-event', (req, res) => {
    eventController.getEventDetails(req.query.eventId, (err, info) => {
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
        else res.render('event-detailed', {
            layout: 'dashboardLayout.hbs',
            name: JSON.parse(info.info).name,
            date: JSON.parse(info.info).date,
            description: JSON.parse(info.info).description,
            venue: JSON.parse(info.info).venue,
            budget: JSON.parse(info.info).budget,
            commId: req.query.commId,
            eventId: req.query.eventId
        });
    });
});

router.get('/delete-event', (req, res) => {
    eventController.deleteEvent(req.query.eventId, (err, info) => {
        console.log(err);
        if(err) res.render('error', {
            title: 'CMS',
            status: '400',
            message: err.info.toString(),
            commId: req.query.commId
        });
        else res.render('successful', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            message: 'Successfully Removed Event!',
            commId: req.query.commId
        });
    });
});

// API Routes
router.post('/api/create', (req, res) => {
    const date = new Date(req.body.date);
    eventController.createNewEvent(req.body.name, req.body.description, req.body.venue, date, parseInt(req.body.budget), req.body.conductedBy, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

router.get('/api/all', (req, res) => {
    eventController.getAllEvents((err, info) => {
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

router.get('/api/get-event', (req, res) => {
    // get commId in every request
    eventController.getEventDetails(req.query.eventId, (err, info) => {
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;