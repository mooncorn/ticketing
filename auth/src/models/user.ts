import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

// An interface that descirbes the properties
// that a User Document has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// Methods are used to define instance methods

// Statics are used to define object methods
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// userSchema.statics.findByCredentials = async (username, password) => {
//   const user = await User.findOne({ username });

//   if (!user) {
//     throw new BadRequestError('Unable to login');
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new BadRequestError('Unable to login');
//   }

//   return user;
// };

// userSchema.methods.toJSON = function () {
//   const user = this;
//   const userObject = user.toObject();

//   userObject.id = userObject._id;
//   delete userObject._id;
//   delete userObject.__v;
//   delete userObject.password;

//   return userObject;
// };

// Hash the plain text password
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  done();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User };
