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
            info: JSON.stringify(newSponsor)
        });
    });
}

function sponsorCommunity(sponsorId, communityId, amount, callback){
    Sponsor.findOne({_id: sponsorId}).exec((err, sponsor) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding sponsor",
            info: err
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
                else {
                    const sponsorship = {
                        community: community._id,
                        amount: parseInt(amount)
                    };
                    console.log(typeof(sponsorship.amount));
                    sponsor.communities.push(sponsorship);
                    sponsor.save(err => {
                        console.log(err);
                        if(err) return callback({
                            status: 400,
                            message: "Error in saving sponsorship details",
                            info: JSON.stringify(err)
                        });
                        callback(null, {
                            status: 200,
                            message: "Successfully added sponsor",
                            info: sponsor
                        });
                    });
                }
            });
        }
    });
}

function getSponsorDetails(sponsorId, callback){
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
            callback(null, {
                status: 200,
                message: "Successfully found sponsor",
                info: sponsor
            });
        }
    });
}

function getSponsorsOfCommunity(communityId, callback){
    // TODO : Fix this
    Sponsor.find({'communities.community': communityId}).exec((err, sponsors) => {
        //console.log(sponsors[0]);
        if(err) return callback({
            status: 400,
            message: "Error in finding sponsors",
            info: JSON.stringify(err)
        });
        else {
            // Bugged code
            /*let c = 0;
            let sponsorsUpdated = [];
            sponsors.forEach(sponsor => {
                sponsor['amount'] = sponsor.communities[0].amount;
                c++;
                console.log(sponsor);
                sponsorsUpdated.push(sponsor);
                if(c === sponsors.length){
                    callback(null, {
                        status: 200,
                        message: "Successfully found sponsors",
                        info: JSON.stringify(sponsorsUpdated)
                    });
                }
            });*/
            callback(null, {
                status: 200,
                message: "Successfully found sponsors",
                info: JSON.stringify(sponsors)
            });
        }
    });
}

function deleteSponsor(sponsorId, callback){
    Sponsor.remove({_id: sponsorId}, err => {
        if(err) return callback({
            status: 400,
            message: "Error in removing sponsor",
            info: err
        });
        callback(null, {
            status: 200,
            message: "sponsor removed",
            info: "sponsor removed"
        });
    });
}

module.exports = {
    'createNewSponsor': createNewSponsor,
    'sponsorCommunity': sponsorCommunity,
    'getSponsorDetails': getSponsorDetails,
    'getSponsorsOfCommunity': getSponsorsOfCommunity,
    'deleteSponsor': deleteSponsor
}