require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const indexRouter = require("./routes/index");

const app = express();

// Set up mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.DATABASE_URL;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", `script-src 'self' 'unsafe-inline' http://localhost:3000/client/dist/;`);
    next();
});

app.use("/api", indexRouter);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
