const models = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")


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

    await emailService.sendRegistrationEmail(user.email, user.name)

    return res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}



async function userLoginController(req,res) {
    const {email,password} = req.body

    const user = await models.findOne({email}).select("+password")
    
    if(!user){
        return res.status(401).json({
            message:"Email or Password Invalid"
        })
    }
    const isPassword = await user.comparePassword(password)

    if(!isPassword){
        return res.status(401).json({
            message:"Email or Password Invalid"
        })
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SEC,{expiresIn:"3d"})

    res.cookie("token",token)

    return res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
}

module.exports = {
    userRegisterController,
    userLoginController
}