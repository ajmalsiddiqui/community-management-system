const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//TODO: amount
const sponsorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  communities: 
    [new Schema({
      community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
      },
      amount: {
        type: String
      }
    })]
},
{
  toObject: {
    virtuals: true
  },

  toJSON: {
    virtuals: true
  }
});

sponsorSchema.virtual('url').get(function(){
  return '../sponsor/sponsorDetails?sponsorId=' + this._id
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;
