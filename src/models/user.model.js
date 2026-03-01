const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:[true,"Please provide email adress."],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,"Invalid email adress"],
        unique:[true,"Email adress already taken"],
    },
    name:{
        type: String,
        required:[true,"Name is needed to make a account"],
    },
    password:{
        type: String,
        required:[true,"Password is required"],
        select: true,
        minlength: [8,"Password should be 8 characters long"]
    }
},{
    timestamps : true
})