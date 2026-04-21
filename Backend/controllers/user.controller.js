import User from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";
import httpStatus from "http-status";
import crypto from "crypto";

const register = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "user already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "user created successfully" });


    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `internal server error${err.message}` });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "not found the username or password" })
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "not found the username" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "invalid password" });
        }
        let token = crypto.randomBytes(32).toString("hex");
        user.token = token;
        await user.save();
        return res.status(httpStatus.OK).json({ message: "login successfull", token: token });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `internal server error${err.message}` });
    }
};

const addToActivity = async (req, res) => {
    const { token, meeting_code } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
        }
        user.meetings.push(meeting_code);
        await user.save();
        res.status(httpStatus.OK).json({ message: "meeting added to activity" });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `internal server error${err.message}` });
    }
};

const getAllActivity = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
        }
        res.status(httpStatus.OK).json({ meetings: user.meetings });
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `internal server error${err.message}` });
    }
};

export { register, login, addToActivity, getAllActivity };

