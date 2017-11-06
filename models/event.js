const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
      type: String,
      required: true
  },

  venue: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  budget: {
    type: String,
    default: 0
  },

  conductedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  }
},
{
  toObject: {
    virtuals: true
  },
  
  toJSON: {
    virtuals: true
  }
});

eventSchema.virtual('url').get(function(){
  return '../event/get-event?eventId=' + this._id
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;