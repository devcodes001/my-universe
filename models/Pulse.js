import mongoose from "mongoose";

const PulseSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coupleId: {
            type: String,
            required: true,
        },
        lastPulse: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Pulse || mongoose.model("Pulse", PulseSchema);
