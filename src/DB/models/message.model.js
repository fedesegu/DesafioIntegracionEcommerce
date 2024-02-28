import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({  
    name: {
        type: String,
        /* required: true,  */      
    },  
    message: {
        type: String,
        /* required: true */
    },
});

export const messageModel = mongoose.model("Messages", messagesSchema);