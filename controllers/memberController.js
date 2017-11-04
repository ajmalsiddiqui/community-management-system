const mongoose = require('mongoose');

const Member = require('../models/member');
const Community = require('../models/community');

const db_url = require('../config').db_url;

//mongoose.connect(db_url);

function createNewMember(memberName, memberPosition, memberDescription, memberSkills, memberCommunity, callback){
    Community.findOne({ $or : [{_id: memberCommunity},
        {name: memberCommunity}]},
        (err, community) => {
            //check for errors in community info
            if(err) return callback({
                status: 400,
                message: "Error in finding community",
                info: JSON.stringify(err)
            });
            else if(!community) return callback({
                status: 400,
                message: "Error: no community with the given name/id",
                info: JSON.stringify(err)
            });
    
            else {
                const newMember = new Member({
                    name: memberName,
                    position: memberPosition,
                    description: memberDescription,
                    skills: memberSkills.split(','),
                    community: community._id
                });
    
                newMember.save(err => {
                    if(err) return callback({
                        status: 400,
                        message: "Error in creating member",
                        info: JSON.stringify(err)
                    });
                    callback(null, {
                        status: 200,
                        message: "Successfully created new member",
                        info: "Successfully created new member"
                    });
                });
            }
        });
}

function getMemberDetails(memberId, callback){
    Member.findOne({_id: memberId}).exec((err, member) => {
        if(err) return callback({
            status: 400,
            message: "Error in creating member",
            info: JSON.stringify(err)
        });
        else if(!member) return callback({
            status: 400,
            message: "No member found",
            info: "No member found"
        });
        callback(null, {
            status: 200,
            message: "Member found",
            info: JSON.stringify(member)
        });
    });
}

module.exports = {
    'createNewMember': createNewMember,
    'getMemberDetails': getMemberDetails
}