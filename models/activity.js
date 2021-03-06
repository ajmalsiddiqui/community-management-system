const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const activitySchema = mongoose.Schema({
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

activitySchema.virtual('url').get(function(){
  return '../activity/get-activity?activityId=' + this._id
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
