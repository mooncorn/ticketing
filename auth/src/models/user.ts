import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../errors/bad-request-error';

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

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Methods are used to define instance methods

// Statics are used to define object methods
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new BadRequestError('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new BadRequestError('Unable to login');
  }

  return user;
};

// Hash the plain text password
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  done();
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

// const user = User.build({ email: 'sdf', password: 'fasd' });

export { User };
