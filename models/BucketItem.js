import mongoose from "mongoose";

const BucketItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "What's the dream?"],
        },
        description: {
            type: String,
            default: "",
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedDate: {
            type: Date,
        },
        memoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Memory",
        },
        coupleId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.BucketItem || mongoose.model("BucketItem", BucketItemSchema);
