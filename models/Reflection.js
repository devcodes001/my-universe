import mongoose from "mongoose";

/**
 * Reflection — Used for the "After a Fight" healing flow.
 * When a user logs a "fight" mood, they answer structured questions.
 * After 24 hours, both partners' reflections become visible side-by-side.
 */
const ReflectionSchema = new mongoose.Schema(
    {
        whatHurt: {
            type: String,
            required: [true, "Please share what hurt you"],
            maxlength: 3000,
        },
        whatLearned: {
            type: String,
            required: [true, "Please share what you learned"],
            maxlength: 3000,
        },
        doDifferently: {
            type: String,
            required: [true, "Please share what you'd do differently"],
            maxlength: 3000,
        },
        mood: {
            type: String,
            default: "🤝",
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
        // Reflections become visible to both partners after this date
        visibleAfter: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

ReflectionSchema.index({ coupleId: 1, createdAt: -1 });

export default mongoose.models.Reflection ||
    mongoose.model("Reflection", ReflectionSchema);
