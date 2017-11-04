const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const communitySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
      type: String,
      required: true
  },

  password: {
    type: String,
    required: true
  },

  sponsors: {
    sponsor : {
      type: [Schema.Types.ObjectId],
      ref: 'Sponsor'
    },

    amount : {
      type : 'Number'
    }
  },

  members: {
    type: [Schema.Types.ObjectId],
    ref: 'Member'
  },

  activities: {
    type: [Schema.Types.ObjectId],
    ref: 'Activity'
  },

  events: {
    type: [Schema.Types.ObjectId],
    ref: 'Event'
  }
});



const Community = mongoose.model('Community', communitySchema);

module.exports = Community;
