import { Schema, model } from "mongoose"

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    googleId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    refreshTokenExp: { type: Date },
    resetPasswordToken: { type: String },
    resetPassTokExp: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    products: [{ type: Schema.Types.ObjectId, ref: "Products" }]
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})


userSchema.pre("save", function (next) {
    if (this.isModified()) this.updated_at = Date.now()
    next()
})

const userData = model("User", userSchema)

export {
    userData
}