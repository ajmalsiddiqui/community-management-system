const bodyParser = require('body-parser');

const router = require('express').Router();

const communityController = require('../controllers/index').communityController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req, res) => {
    res.render('home', {title: 'CMS', loggedIn: 'Log In'});
});

router.post('/create', (req, res) => {
    // founding member details are also passed in here
    console.log(req.body);
    communityController.createNewCommunity(req.body.name, req.body.description, req.body.founder, req.body.password, req.body.fDesc, req.body.fSkills, (err, info) => {
        //all errors and info are returned in JSON format
        //console.log(err.info);
        if(err) res.render('error', {
            //layout: 'dashboardLayout.hbs',
            title: 'CMS',
            status: '400',
            message: err.message.toString()
        });
        // TODO: render dashboard
        else res.redirect('/community/get-members?commId=' + JSON.parse(info.info)._id);
    });
});

router.get('/get-members', (req, res) => {
    communityController.getAllMembersOfCommunity(req.query.commId, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.render('error', {
            title: 'CMS',
            status: '400',
            message: err.message.toString()
        });
        else res.render('members', {
            layout: 'dashboardLayout.hbs',
            members: JSON.parse(info.info),
            title: 'CMS',
            commId: req.query.commId
        });
    });
});

router.post('/login', (req, res) => {
    communityController.login(req.body.name, req.body.password, (err, info) => {
        console.log(info);
        //console.log(info.info);
        if(err) res.render('home', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            errorMsg: err.message.toString()
        });
        // TODO: redirect to dashboard; currently shows members
        else res.redirect('/community/get-members?commId=' + JSON.parse(info.info)._id);
    });
});

// API Routes
router.post('/api/create', (req, res) => {
    // founding member details are also passed in here
    communityController.createNewCommunity(req.body.name, req.body.description, req.body.founder, req.body.password, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

router.get('/api/get-members', (req, res) => {
    communityController.getAllMembersOfCommunity(req.query.commId, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;