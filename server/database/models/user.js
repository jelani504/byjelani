const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  acceptContact: { type: Boolean, require: true },
  title: { type: String, require: true },
  shoppingBag: [],
  // addressBook: {
  //   primaryAddress: {},
  //   secondaryAddresses: []
  // },
  creation_dt: { type: Date, require: true },
});

userSchema.statics.hashPassword = password => bcrypt.hashSync(password, 10);

userSchema.methods.isValid = function isValid(hashedPassword) {
  return bcrypt.compareSync(hashedPassword, this.password);
};

const User = mongoose.model('User', userSchema);

const userHelpers = {
  createUser: user => new User(user).save((err) => {
    if (err) { console.log(err); }
  }),
  findOneUser: (email) => { console.log(email, 'FIND ONE'); return User.findOne(email); },
  updateUser: async (email, key, value) => {
    const user = await User.findOne({email});
    user[key] = value;
    // console.log(user, 'USER');
    return user.save();
  }
};
// User.find({}, (err, docs) => console.log(docs));
// User.remove({}, () => console.log('collection removed'));
module.exports = { User, userHelpers };
