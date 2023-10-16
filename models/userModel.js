import mongoose from "mongoose";

// Define a Mongoose schema without Joi validation
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    date: {
      type: String,
      default: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
    },
    password: String,
    retypepassword: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
