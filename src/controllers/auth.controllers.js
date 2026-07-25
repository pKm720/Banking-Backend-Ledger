const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const blacklistModel = require("../models/blackList.model");
async function userRegisterController(req, res) {
    try {
        const { email, password, name } = req.body;
        const isExist = await userModel.findByEmail(email);
        if (isExist) {
            return res.status(422).json({
                message: "User email already exist.",
                status: "Failed."
            });
        }
        const user = await userModel.createUser({ email, password, name });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SEC,
            { expiresIn: "3d" });
        res.cookie("token", token);
        await emailService.sendRegistrationEmail(user.email, user.name);
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;
        // Use the special function that includes password hash
        const user = await userModel.findByEmailWithPassword(email);
        if (!user) {
            return res.status(401).json({
                message: "Email or Password Invalid"
            });
        }
        const isPassword = await userModel.comparePassword(password,
            user.password);
        if (!isPassword) {
            return res.status(401).json({
                message: "Email or Password Invalid"
            });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SEC,
            { expiresIn: "3d" });
        res.cookie("token", token);
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        });
    }
    await blacklistModel.blacklistToken(token);
    res.clearCookie("token");
    return res.status(200).json({
        message: "User logged out successfully"
    });
}
module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
};