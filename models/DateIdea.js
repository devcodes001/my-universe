import mongoose from "mongoose";

/**
 * DateIdea — Couple's shared date night idea pool.
 * Both partners can add ideas. The spinner randomly picks one.
 */
const DateIdeaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 200,
        },
        category: {
            type: String,
            enum: ["home", "outdoor", "adventure", "fancy", "creative", "spontaneous"],
            default: "home",
        },
        addedBy: {
            type: String,
            required: true,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
        coupleId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

DateIdeaSchema.index({ coupleId: 1 });

export default mongoose.models.DateIdea ||
    mongoose.model("DateIdea", DateIdeaSchema);
