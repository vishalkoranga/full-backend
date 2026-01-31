/*import dotenv from "dotenv";
dotenv.config({
  path: './.env'
});*/   //env variables are being loded from scripts in package.json
import connectDB from "./db/index.js";
import app from "./app.js";


connectDB()
.then(()=>{
  app.listen(process.env.PORT || 4000 , ()=>{
    console.log(`app is running on port ${process.env.PORT}`)
  })
})
.catch((err)=>{
     console.log("app connection failied", err);
      process.exit(1);
})









/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
    console.log("✅ MongoDB connected");
    app.on("error",(error)=>{
        console.log("err:", error);
        throw error
    }) 

    app.listen(process.env.PORT, ()=>{
        console.log(`app is listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("❌ ERROR:", error);
    throw error;
  }
})();
*/