import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, "Please write something for your journal"],
        },
        date: {
            type: Date,
            default: Date.now,
            required: true,
        },
        mood: {
            type: String,
            enum: ["✨", "❤️", "😊", "🥰", "🌟", "🎉", "🥺", "💫", "🍃", "☁️"],
            default: "😊",
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

// Ensure only one journal entry per user per day if needed, 
// or just index for fast lookup
JournalSchema.index({ coupleId: 1, date: -1 });

export default mongoose.models.Journal || mongoose.model("Journal", JournalSchema);
