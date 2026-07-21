const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blackList.model");
async function verifyToken(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, Invalid token given"
        });
    }
    const isBlacklisted = await blacklistModel.isTokenBlacklisted(token);
    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SEC);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }
        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, Invalid token given"
        });
    }
}
async function authSystemMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access, Invalid token given"
        });
    }
    const isBlacklisted = await blacklistModel.isTokenBlacklisted(token);
    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SEC);
        // Uses the special function that includes system_user field
        const user = await userModel.findByIdWithSystemUser(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found"
            });
        }
        if (!user.is_system_user) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            });
        }
        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access, Invalid token given"
        });
    }
}
module.exports = {
    verifyToken,
    authSystemMiddleware,
};