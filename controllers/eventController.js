const mongoose = require('mongoose');

const Event = require('../models/event');
const Community = require('../models/community');

const db_url = require('../config').db_url;

//mongoose.connect(db_url);

function createNewEvent(eventName, eventDesc, eventVenue, eventDate, eventBudget, conductedBy, callback){
    Community.findOne({ $or : [{_id: conductedBy},
        {name: conductedBy}]},
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
                info: "Error: no community with the given name/id"
            });
    
            else {
                const newEvent = new Event({
                    name: eventName,
                    description: eventDesc,
                    venue: eventVenue,
                    date: eventDate,
                    budget: eventBudget,
                    conductedBy: community._id
                });
    
                newEvent.save(err => {
                    if(err) return callback({
                        status: 400,
                        message: "Error in creating event",
                        info: JSON.stringify(err)
                    });
                    callback(null, {
                        status: 200,
                        message: "Successfully created new event",
                        info: "Successfully created new event"
                    });
                });
            }
        });
}

module.exports = {
    'createNewEvent': createNewEvent
}