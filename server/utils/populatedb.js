#! /usr/bin/env node

console.log(
    'This script populates some messages to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require("../models/User");
const Message = require("../models/Message");

const messages = [];
const users = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    //await createUsers();
    await createMessages();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function userCreate(index, username, email, password) {
    const userDetail = { username, email, password };

    const user = new User(userDetail);

    await user.save();
    users[index] = user;
    console.log(`Added user: ${username}`);
}

async function messageCreate(index, title, text, author) {
    const messageDetail = {
        title: title,
        text: text,
        author: author,
    };

    const message = new Message(messageDetail);
    await message.save();
    messages[index] = message;
    console.log(`Added message: ${title}`);
}

async function createUsers() {
    console.log("Adding users");
    await Promise.all([
        userCreate(0, "user1", "user1@example.com", "password1"),
        userCreate(1, "user2", "user2@example.com", "password2"),
        userCreate(2, "user3", "user3@example.com", "password3"),
        userCreate(3, "user4", "user4@example.com", "password4"),
        userCreate(4, "user5", "user5@example.com", "password5"),
    ]);
}

async function createMessages() {
    console.log("Adding messages");
    await Promise.all([
        messageCreate(0, "Message 1", "This is the text of message 1.", users[0]),
        messageCreate(1, "Message 2", "This is the text of message 2.", users[1]),
        messageCreate(2, "Message 3", "This is the text of message 3.", users[2]),
        messageCreate(1, "Message 4", "This is the text of message 4.", users[3]),
        messageCreate(2, "Message 5", "This is the text of message 5.", users[4]),
    ]);
}
