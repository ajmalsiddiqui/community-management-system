const mongoose = require('mongoose');

const Sponsor = require('../models/sponsor');
const Community = require('../models/community');

const db_url = require('../config').db_url;

//mongoose.connect(db_url);

function createNewSponsor(sponsorName, callback){
    const newSponsor = new Sponsor({
        name: sponsorName
    });
    newSponsor.save(err => {
        if(err) return callback({
            status: 400,
            message: "Error in creating sponsor",
            info: JSON.stringify(err)
        });
        else callback(null, {
            status: 200,
            message: "Successfully created new sponsor",
            info: "Successfully created new sponsor"
        });
    });
}

function sponsorCommunity(sponsorId, communityId, amount, callback){
    Sponsor.findOne({_id: sponsorId}).exec((err, sponsor) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding sponsor",
            info: JSON.stringify(err)
        });
        else if(!sponsor) return callback({
            status: 400,
            message: "Error: no sponsor found for this Id",
            info: "Error: no sponsor found for this Id"
        });
        else {
            Community.findOne({_id: communityId}).exec((err, community) => {
                if(err) return callback({
                    status: 400,
                    message: "Error in finding community",
                    info: JSON.stringify(err)
                });
                else if(!community) return callback({
                    status: 400,
                    message: "Error: no community found for this Id",
                    info: "Error: no community found for this Id"
                });
                const sponsorship = {
                    community: community._id,
                    amount: amount
                };
                sponsor.communities.push(sponsorship);
                sponsor.save(err => {
                    if(err) return callback({
                        status: 400,
                        message: "Error in saving sponsorship details",
                        info: JSON.stringify(err)
                    });
                    callback(null, {
                        status: 200,
                        message: "Successfully added sponsor",
                        info: "Successfully added sponsor"
                    });
                });
            });
        }
    });
}

module.exports = {
    'createNewSponsor': createNewSponsor,
    'sponsorCommunity': sponsorCommunity
}