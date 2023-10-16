// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to Mongodb Database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in Mongodb ${error}`);
  }

  // try {
  //   await mongoose.connect(process.env.uri, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });

  //   console.log("MongoDB connected");
  // } catch (error) {
  //   console.error("Error connecting to MongoDB:", error.message);
  //   process.exit(1); // Exit with a failure code
  // }
};

export default connectDB;
