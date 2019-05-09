const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
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
  gender: {type: String},
  creation_dt: { type: Date, require: true },
});

userSchema.statics.hashPassword = password => bcrypt.hashSync(password, 10);

userSchema.methods.isValid = function isValid(hashedPassword) {
  return bcrypt.compareSync(hashedPassword, this.password);
};

userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) return next(err);

          // override the cleartext password with the hashed one
          user.password = hash;
          next();
      });
  });
});

const User = mongoose.model('User', userSchema);

const userHelpers = {
  createUser: user => new User(user).save((err) => {
    if (err) { console.log(err); }
  }),
  findOneUser: async email =>  await User.findOne({email}),
  clearBag: async email => {
    const user = await User.findOne({email});
    user.shoppingBag = [];
    return await user.save();
  },
  updateUser: async (email, key, value, changedValues) => {
    const user = await User.findOne({email});
    if(changedValues){
      changedValues.forEach(
        newPair => {
          const updateKey = Object.keys(newPair)[0];
          if(updateKey === 'newPassword'){
            user.password = newPair[updateKey];
          } 
          else {
            if(updateKey === 'gender'){
              if(newPair[updateKey] === 'Male'){
                user.title = 'Mr.';
              }
              else {
                user.title = 'Ms.'
              }
            }
            user[updateKey] = newPair[updateKey];
          }
        }
      );
    } else {
      user[key] = value;
    }
    return user.save();
  }
};
// User.find({}, (err, docs) => console.log(docs));
// User.remove({}, () => console.log('collection removed'));
module.exports = { User, userHelpers };
