import mongoose from "mongoose";

let URI = `mongodb://localhost:27017/twitter-clone`;
async function connectingDB() {    
    try {
        await mongoose.connect(URI);
        console.log('Database connected successfully ✔');
    } catch (error) {
        console.log('Error connecting to the database ❌');
        console.log(error.message);
        process.exit(1);
    }
}
export default connectingDB;