const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function verifyToken (req,res,next){

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message: "Unauthorization access, Invalid token given"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SEC)

        const user = await userModel.findById(decoded.userId)

        req.user = user

        return next()

    }catch (err){
        return res.status(401).json({
            message: "Unauthorization access, Invalid token given"
        })
    }
}

async function authSystemMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message: "Unauthorization access, Invalid token given"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SEC)

        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })  
        }

        req.user = user

        return next()

    }catch (err){
        return res.status(401).json({
            message: "Unauthorization access, Invalid token given"
        })
    }
}



module.exports = {
    verifyToken
}