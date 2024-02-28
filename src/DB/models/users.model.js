import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({  
    name: {
        type: String,
        required: true,      
    },  
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartId: {
        type: Object,
    },
    role: {
        type: String,
        enum: ["admin", "user", "premium"],
        default: 'user',
    },
    documents: {
        type: [
            {
                name: String,
                reference: String,
            },
        ],
        default: [],
    },
    last_connection :{
        type: Date,
    },
    avatar : {
        type: [
            {
                name: String,
                reference: String,
            }
        ]
    },
    last_connection :{
        type: Date,
    }
});


export const usersModel = mongoose.model("Users", usersSchema);