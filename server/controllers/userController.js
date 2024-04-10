require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token is not valid" });
    }
});

exports.create_user = [
    body("username", "Username must not be empty").trim().isLength({ min: 1 }).escape(),
    body("email", "Email must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password", "Password must not be empty").isLength({ min: 1 }).escape(),
    body("confirmPassword", "Password must match").custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async (req, res, next) => {
        try {
            const error = validationResult(req);

            const existingUserWithEmail = await User.findOne({ email: req.body.email });
            if (existingUserWithEmail) {
                return res.status(400).json({ error: "Email already in use." });
            }

            if (!error.isEmpty()) {
                console.error(error.array());
                return res.status(400).json(error.array());
            } else {
                bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                    if (err) return next(err);
                    else {
                        const user = new User({
                            username: req.body.username,
                            email: req.body.email,
                            password: hashedPassword,
                        });
                        await user.save();
                        res.status(200).json({ message: "success" });
                    }
                });
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }),
];

exports.get_user = asyncHandler(async (req, res, next) => {
    try {
        const userObj = await User.findById(req.user.id);

        if (userObj === null) return res.status(404).json({ error: "user not found" });

        const user = {
            id: userObj.id,
            username: userObj.username,
            email: userObj.email,
            is_admin: userObj.is_admin,
            is_member: userObj.is_member,
        };
        res.status(200).json({ user });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.login_user = [
    body("email", "Email must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password", "Password must not be empty").isLength({ min: 1 }).escape(),

    asyncHandler(async (req, res, next) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                console.error(error.array());
                return res.status(400).json(error.array());
            } else {
                const user = await User.findOne({ email: req.body.email });
                if (user) {
                    const match = await bcrypt.compare(req.body.password, user.password);
                    if (!match) {
                        return res.status(404).json({ error: "Incorrect password" });
                    } else {
                        const token = jwt.sign(
                            { id: user.id, username: user.username, email: user.email, is_member: user.is_member, is_admin: user.is_admin },
                            process.env.SECRET_KEY,
                            {
                                expiresIn: "24h",
                            }
                        );
                        return res.json({
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                is_member: user.is_member,
                                is_admin: user.is_admin,
                            },
                            token,
                        });
                    }
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            }
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }),
];

exports.become_admin = asyncHandler(async (req, res, next) => {
    try {
        if (req.body.code === "secretcode") {
            const user = await User.findByIdAndUpdate(req.user.id, { is_admin: true });
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_member: user.is_member,
                    is_admin: true,
                },
            });
        } else {
            res.status(401).json({ error: "Incorrect code" });
        }
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

exports.become_member = asyncHandler(async (req, res, next) => {
    try {
        if (req.body.code === "secretcode") {
            const user = await User.findByIdAndUpdate(req.user.id, { is_member: true });
            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    is_member: true,
                    is_admin: user.is_admin,
                },
            });
        } else {
            res.status(401).json({ error: "Incorrect code" });
        }
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});
