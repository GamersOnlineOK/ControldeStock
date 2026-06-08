import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true, select: false },
        role: { type: String, enum: ['superadmin', 'admin', 'user'], default: 'user' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
