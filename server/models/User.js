const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, minLength: 1, maxLength: 100 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_member: { type: Boolean, default: false },
    is_admin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
