import mongoose from "mongoose";

const LetterSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Please write your letter"],
        },
        openDate: {
            type: Date,
            required: [true, "Please set a date to open this letter"],
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        coupleId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

LetterSchema.index({ coupleId: 1, openDate: 1 });

export default mongoose.models.Letter ||
    mongoose.model("Letter", LetterSchema);
