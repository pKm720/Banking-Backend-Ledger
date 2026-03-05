const user = require("../models/user.model")
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

        const user = await user.findById(decoded.userId)

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