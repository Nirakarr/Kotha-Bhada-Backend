import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authAdminRoutes from "./routes/authAdminRoutes.js";
import authUserRoutes from "./routes/authUserRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import commentRoute from "./routes/commentRoute.js";
import postRoute from "./routes/PostRoute.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Use bodyParser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

app.use(cors());

app.use("/admin", authAdminRoutes);
app.use("/user", authUserRoutes);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use(express.static("Images/CardsImages"));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Kotha Bhada Nepal</h1>");
});

app.listen(PORT, () => {
  console.log(`Node Server is running on port ${PORT}`);
});
