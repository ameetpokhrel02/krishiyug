import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
});


// --function to connect to db
const connectDB = (uri) => {
    mongoose
    .connect(uri, { dbName: "krishiyug" })
    .then((data)=> console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err)=> {
        throw err;
    });
}


export { connectDB };