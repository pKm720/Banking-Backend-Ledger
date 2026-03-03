const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true,"Please provide email adress."],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email adress"],
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

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        return
    }
    const hash = await bcrypt.hash(this.password,6)
    this.password = hash;

    return

})
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;