import mongoose from "mongoose";

/**
 * DailyQuestion — Both partners answer independently, answers revealed after both submit.
 */
const QuestionAnswerSchema = new mongoose.Schema(
    {
        questionId: {
            type: String,
            required: true,
        },
        questionText: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
            maxlength: 2000,
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

QuestionAnswerSchema.index({ coupleId: 1, questionId: 1 });

export default mongoose.models.QuestionAnswer ||
    mongoose.model("QuestionAnswer", QuestionAnswerSchema);
