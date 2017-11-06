const mongoose = require('mongoose');

const Activity = require('../models/activity');
const Community = require('../models/community');

const db_url = require('../config').db_url;

//mongoose.connect(db_url);

function createNewActivity(activityName, activityDesc, activityVenue, activityDate, conductedBy, callback){
    Community.findOne({_id: conductedBy},
        (err, community) => {
            //check for errors in community info
            if(err) return callback({
                status: 400,
                message: "Error in finding community",
                info: JSON.stringify(err).trim()
            });
            else if(!community) return callback({
                status: 400,
                message: "Error: no community with the given name/id",
                info: "Error: no community with the given name/id"
            });
    
            else {
                const newActivity = new Activity({
                    name: activityName,
                    description: activityDesc,
                    venue: activityVenue,
                    date: activityDate,
                    conductedBy: community._id
                });
    
                newActivity.save(err => {
                    if(err) return callback({
                        status: 400,
                        message: "Error in creating activity",
                        info: JSON.stringify(err)
                    });
                    else callback(null, {
                        status: 200,
                        message: "Successfully created activity",
                        info: newActivity
                    });
                });
            }
        });
}

function getActivityDetails(activityId, callback){
    Activity.findOne({_id: activityId}).exec((err, activity) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding activity",
            info: JSON.stringify(err)
        });
        else if(!activity) return callback({
            status: 400,
            message: "Error: no activity with this id",
            info: "Error: no activity with this id"
        });
        else callback(null, {
            status: 200,
            message: "Successfully found activity",
            info: JSON.stringify(activity)
        });
    });
}

function deleteActivity(activityId, callback){
    Activity.remove({_id: activityId}, err => {
        if(err) return callback({
            status: 400,
            message: "Error in removing activity",
            info: JSON.stringify(err)
        });
        callback(null, {
            status: 200,
            message: "activity removed",
            info: "activity removed"
        });
    });
}

function getActivitiesOfCommunity(communityId, callback){
    Activity.find({conductedBy: communityId}).exec((err, activities) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding activities",
            info: JSON.stringify(err)
        });
        callback(null, {
            status: 200,
            message: "Successfully found activities",
            info: JSON.stringify(activities)
        });
    });
}

module.exports = {
    'createNewActivity': createNewActivity,
    'getActivityDetails': getActivityDetails,
    'deleteActivity': deleteActivity,
    'getActivitiesOfCommunity': getActivitiesOfCommunity
}