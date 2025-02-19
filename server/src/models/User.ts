import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
    email: string;
    password: string;
    isAdmin: boolean;
}

const userSchema: Schema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false}
});

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);

export {User, IUser}