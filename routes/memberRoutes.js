const bodyParser = require('body-parser');

const router = require('express').Router();

const memberController = require('../controllers/index').memberController;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/create', (req, res) => {
    console.log(req.body);
    memberController.createNewMember(req.body.name, req.body.position, req.body.description, req.body.skills, req.body.community, (err, info) => {
        if(err)  {
            console.log(err);
            res.render('error', {
            title: 'CMS',
            status: '400',
            message: err.message.toString(),
            commId: req.body.community
        });
        }
        // TODO: successfully added member page 
        else res.render('successful', {
            layout: 'dashboardLayout.hbs',
            title: 'CMS',
            message: 'Successfully Added Member!',
            commId: req.body.community
        });
    });
});

router.get('/member-details', (req, res) => {
    memberController.getMemberDetails(req.query.memberId, (err, info) => {
        //all errors and info are returned in JSON format
        console.log(err);
        console.log(info);
        if(err) res.render('error', {
            title: 'CMS',
            status: '400',
            message: err.body.toString(),
            commId: req.query.commId
        });
        // TODO: render details of member
        else res.render('member-detailed', {
            layout: 'dashboardLayout.hbs',
            name: JSON.parse(info.info).name,
            position: JSON.parse(info.info).position,
            description: JSON.parse(info.info).description,
            skills: JSON.parse(info.info).skills,
            commId: req.query.commId
        });
    });
});

// API routes
router.post('/api/create', (req, res) => {
    memberController.createNewMember(req.body.name, req.body.position, req.body.description, req.body.skills, req.body.community, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

router.get('/api/member-details', (req, res) => {
    memberController.getMemberDetails(req.query.memberId, (err, info) => {
        //all errors and info are returned in JSON format
        if(err) res.status(400).json(JSON.stringify(err));
        else res.status(200).json(JSON.stringify(info));
    });
});

module.exports = router;