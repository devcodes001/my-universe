import mongoose from "mongoose";

const LoveNoteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please write a reason you love her"],
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

export default mongoose.models.LoveNote || mongoose.model("LoveNote", LoveNoteSchema);
