import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("conneted db");
  } catch (err) {
    console.log(err);
  }
};

export { connectDb };
