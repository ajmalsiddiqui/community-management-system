const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const memberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  position: {
      type: String,
      required: true,
      default: 'Core Member'
  },

  description: {
    type: String,
    required: true
  },

  skills: {
    type: [String]
  },

  community: {
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

memberSchema.virtual('url').get(function(){
  return '../member/member-details?memberId=' + this._id
});


const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
