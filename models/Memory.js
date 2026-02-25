import mongoose from "mongoose";

const MemorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        date: {
            type: Date,
            required: [true, "Please provide a date"],
        },
        imageUrl: {
            type: String,
            default: "",
        },
        audioUrl: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            enum: ["milestone", "date", "travel", "everyday", "special"],
            default: "everyday",
        },
        mood: {
            type: String,
            enum: ["❤️", "😊", "🥰", "✨", "🌟", "🎉", "🥺", "💫"],
            default: "❤️",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coupleId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

MemorySchema.index({ coupleId: 1, date: -1 });

export default mongoose.models.Memory ||
    mongoose.model("Memory", MemorySchema);
