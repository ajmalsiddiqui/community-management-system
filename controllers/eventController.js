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
                    console.log(err);
                    if(err) return callback({
                        status: 400,
                        message: "Error in creating event",
                        info: JSON.stringify(err)
                    });
                    callback(null, {
                        status: 200,
                        message: "Successfully created new event",
                        info: JSON.stringify(newEvent)
                    });
                });
            }
        });
}

function getAllEvents(callback){
    Event.find({}).exec((err, events) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding events",
            info: JSON.stringify(err)
        });
        callback(null, {
            status: 200,
            message: "Successfully found events",
            info: JSON.stringify(events)
        });
    });
}

function getEventDetails(eventId, callback){
    Event.findOne({_id: eventId}).exec((err, event) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding event",
            info: JSON.stringify(err)
        });
        else if(!event) return callback({
            status: 400,
            message: "Error: no event with this id",
            info: "Error: no event with this id"
        });
        callback(null, {
            status: 200,
            message: "Successfully found event",
            info: JSON.stringify(event)
        });
    });
}

function deleteEvent(eventId, callback){
    Event.remove({_id: eventId}, err => {
        if(err) return callback({
            status: 400,
            message: "Error in removing event",
            info: err
        });
        callback(null, {
            status: 200,
            message: "event removed",
            info: "event removed"
        });
    });
}

function getEventsOfCommunity(communityId, callback){
    Event.find({conductedBy: communityId}).exec((err, events) => {
        if(err) return callback({
            status: 400,
            message: "Error in finding events",
            info: JSON.stringify(err)
        });
        callback(null, {
            status: 200,
            message: "Successfully found events",
            info: JSON.stringify(events)
        });
    });
}

module.exports = {
    'createNewEvent': createNewEvent,
    'getAllEvents': getAllEvents,
    'getEventDetails': getEventDetails,
    'deleteEvent': deleteEvent,
    'getEventsOfCommunity': getEventsOfCommunity
}