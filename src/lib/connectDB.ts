import mongoose from "mongoose";

const connection:{connected:boolean}={connected:false}

export default async function connectDB(){
    console.log('connection = '+JSON.stringify(connection));
    
    try {
        if(connection.connected){
            console.log('DB Already connected');
            return connection
        }
        await mongoose.connect('mongodb+srv://sohampirale20504:NevilleMongoDB@demo.3du8dza.mongodb.net/nextJS_Learning')
        connection.connected=true
        console.log('DB connected successfully');
        return connection;
    } catch (error) {
        console.log('ERROR while connecting DB ERROR : '+error);
        throw error
    }
}