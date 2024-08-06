import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {

// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
// 99 = uninitialized

    // Check connection : for not repeat connect 
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log(`🎉 🎉 🎉 ` + 'Already connected');
        return;
    }

    // If connecting , do somethings
    if (connectionState === 2) {
        console.log(`🔨 🔨 🔨` + 'Connecting...');
        return;
    }

    // 
    try {
        mongoose.connect(MONGODB_URI!, {
            dbName: "next14-mongodb-restapis",
            bufferCommands: true
        });
        console.log(`🎉 🎉 🎉 ` + "Connected");
    } catch (err: unknown) {
        console.error(`🔥 🔥 🔥 🔥 🔥 Oops !!! : Have error `, err);
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error(`Have Error connection server : ${err}`);
        }
    }   
}

export default connect;