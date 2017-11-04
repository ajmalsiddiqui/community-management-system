const mongoose = require('mongoose');

const Activity = require('../models/activity');
const Community = require('../models/community');

const db_url = require('../config').db_url;

//mongoose.connect(db_url);

function createNewActivity(activityName, activityDesc, activityVenue, activityDate, conductedBy, callback){
    Community.findOne({ $or : [{name: conductedBy},
        {_id: conductedBy}]},
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
                    callback(null, {
                        status: 200,
                        message: "Successfully created activity",
                        info: "Successfully created activity"
                    });
                });
            }
        });
}

module.exports = {
    'createNewActivity': createNewActivity
}