import mongoose from "mongoose";
import { hashPassword } from "../services";

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

userSchema.pre("save", async function (save) {
  if (this.isModified("password")) {
    const hashedPassword = await hashPassword(this.get("password"));
    this.set("password", hashedPassword);
  }
  save();
});

userSchema.statics.build = (user: UserInterface) => {
  return new User(user);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
