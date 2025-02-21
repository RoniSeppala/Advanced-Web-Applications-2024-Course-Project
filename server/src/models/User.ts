import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
    email?: string;
    password?: string;
    isAdmin: boolean;
    googleId?: string;
    facebookId?: string;
    twitterId?: string;
    displayName?: string;
}

const userSchema: Schema = new Schema({
    email: {type: String, required: false},
    password: {type: String, required: false},
    isAdmin: {type: Boolean, required: true, default: false},
    googleId: {type: String, required: false},
    facebookId: {type: String, required: false},
    twitterId: {type: String, required: false},
    displayName: {type: String, required: false}
});

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export {User, IUser}