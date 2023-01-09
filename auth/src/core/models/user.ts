import mongoose from "mongoose";

interface UserInterface {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build(user: UserInterface): UserDocument;
}

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

userSchema.statics.build = (user: UserInterface) => {
  return new User(user);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
