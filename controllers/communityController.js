const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Community = require('../models/community');
const Member = require('../models/member');
const Activity = require('../models/activity');
const Event = require('../models/event');
const Sponsor = require('../models/sponsor');
const config = require('../config');

const db_url = config.db_url;

/*mongoose.connect(db_url, (err) => {
    if(err) console.log(err);
});*/

function createNewCommunity(commName, commDesc, commFounder, commPassword, founderDesc, founderSkills, callback){
    console.log('hello comm');

    bcrypt.hash(commPassword, config.saltRounds, function(err, hash) {
        const newCommunity = new Community({
            name: commName,
            description: commDesc,
            password: hash
        });
    
        const founder = new Member({
            name: commFounder,
            position: 'Founding Member',
            community: newCommunity._id,
            skills: founderSkills.split(','),
            description: founderDesc
        });

        console.log(founder);
    
        newCommunity.save(err => {
            console.log('save');
            if(err) console.log(err);
            if(err) return callback({
                status: 400,
                message: "Error in creating community",
                info: JSON.stringify(err)
            });
            founder.save(err => {
                if(err) return callback({
                    status: 400,
                    message: "Error in creating community",
                    info: JSON.stringify(err)
                });
                else callback(null, {
                    status: 200,
                    message: "Successfully created community and founding member",
                    info: JSON.stringify(newCommunity)
                });
            });
        });
    });
}

function getAllMembersOfCommunity(commId, callback){
    Member.find({community: commId}).exec((err, members) => {
        console.log(err);
        if(err) return callback({
            status: 400,
            message: "Error in getting members",
            info: JSON.stringify(err)
        });
        console.log(members);
        callback(null, {
            status: 200,
            message: "Successful query",
            info: JSON.stringify(members)
        });
    });
}

function login(name, password, callback){
    // TODO: write login function
    Community.findOne({name: name}).exec((err, community) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding community",
            info: JSON.stringify(err)
        });
        else if(!community) return callback({
            status: 400,
            message: "Error: no such community found",
            info: "Error: no such community found"
        });
        bcrypt.compare(password, community.password, function(err, res) {
            if(!res) return callback({
                status: 400,
                message: "Error: invalid credentials",
                info: "Error: invalid credentials"
            });
            callback(null, {
                status: 200,
                message: "Logged in successfully",
                info: JSON.stringify(community)
            });
        });
    });
}
/*function addSponsor(sponsor, community, callback){
    Sponsor.findOne($or : [
        {_id: sponsor},
        {name: sponsor}
    ]);
}*/

module.exports = {
    'createNewCommunity': createNewCommunity,
    'getAllMembersOfCommunity': getAllMembersOfCommunity,
    'login': login
}