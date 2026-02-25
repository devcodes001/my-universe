import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
            select: false,
        },
        partnerEmail: {
            type: String,
            lowercase: true,
            trim: true,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
        },
        coupleId: {
            type: String,
            default: "",
        },
        anniversaryDate: {
            type: Date,
        },
        milestoneName: {
            type: String,
            default: "Our Special Day",
        },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
