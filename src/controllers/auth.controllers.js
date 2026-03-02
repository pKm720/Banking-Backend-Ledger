const models = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function userRegisterController (req,res){
    const {email, password, name} = req.body

    const isExist  = await models.findOne({
        email: email
    })

    if(isExist){
        return res.status(422).json({
            message:"User email already exist.",
            status : "Failed."
        })
    }
    const user = await models.create({
        email, password, name
    })
    const token = jwt.sign({userId:user._id},process.env.JWT_SEC,{expiresIn:"3d"})

    res.cookie("token",token)

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}

module.exports = {
    userRegisterController
}