const Message = require("../models/Message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.get_messages = asyncHandler(async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;

        const totalCount = await Message.countDocuments();
        const messages = await Message.find()
            .sort({ timestamp: -1 })
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .populate({ path: "author", select: "username" })
            .exec();

        if (!messages) return res.json({ error: "no messages" });

        const formattedMessages = messages.map((message) => ({
            ...message.toObject(),
            timestamp_formatted: message.timestamp_formatted,
        }));
        res.json({ formattedMessages, totalCount });
    } catch (err) {
        res.status(404).json({ messages: err.message });
    }
});

exports.create_message = [
    body("text", "Text must not be empty").trim().isLength({ min: 1 }).escape(),

    asyncHandler(async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            console.error(error.array());
            return res.json(error.array());
        } else {
            try {
                const message = new Message({
                    title: req.body.title,
                    text: req.body.text,
                    author: req.user.id,
                });

                await message.save();
                res.status(200).json({ message: "success" });
            } catch (err) {
                res.status(404).json({ message: err.message });
            }
        }
    }),
];

exports.delete_message = asyncHandler(async (req, res, next) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "success" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});
