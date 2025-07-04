import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import errorHandler from "../middleware/error.js";
import { prisma } from "../utils/db.js";
// Interfaces
export const signUp = async (req, res, next) => {
    const { email, fullName, password } = req.body;
    try {
        if (!email || !fullName || !password) {
            return errorHandler(res, 400, "All fields are required");
        }
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return errorHandler(res, 400, "User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
            },
        });
        const accessToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ message: "signup", newUser });
    }
    catch (error) {
        console.log("signup error");
        next(error);
    }
};
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return errorHandler(res, 400, "All fields are required");
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return errorHandler(res, 400, "User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorHandler(res, 400, "Invalid password");
        }
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: "signin", user });
    }
    catch (error) {
        next(error);
    }
};
export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
        res.status(200).json({ message: "signout" });
    }
    catch (error) {
        next(error);
    }
};
export const googleAuth = async (req, res, next) => {
    const { fullName, email } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            const refreshToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
            res.cookie("accesstoken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 1000, // 1 hour
            });
            res.cookie("refreshtoken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(200).json({ message: "signin", user: existingUser });
            return;
        }
        const generatedPassword = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
            },
        });
        const accessToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
        res.cookie("accesstoken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ message: "signup", newUser });
    }
    catch (error) {
        next(error);
    }
};
export const onboardUser = async (req, res, next) => {
    console.log(req.user);
    try {
        const userId = req.params.id;
        const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic, } = req.body;
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                ...req.body,
                isOnboard: true,
            },
        });
        console.log({ ...req.body });
        res.status(200).json({ success: true, user: updatedUser });
    }
    catch (error) {
        next(error);
    }
};
export const verifyUser = async (req, res, next) => {
    const userId = req.user?.id;
    console.log("user id", userId);
    try {
        const authUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        console.log(authUser);
        res.status(200).json({ valid: true, user: authUser });
    }
    catch (error) {
        console.log("errror", error);
        next(error);
    }
};
