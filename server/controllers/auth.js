//For save the Users at the Mongo

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        //Cripto for pwd
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch{
        res.status(500).json({ error: err.message });
     }
};

/* LOGGING IN */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body; //Catch the email and pwd of user send at the body of requisition
        const user = await User.findOne({ email: email }); //find one user that match with the email
        if(!user) return res.status(400).json({msg: "User does nor exists!"});

        const isMatch = await bcrypt.compare(password, user.password); //check that the pwd is equal than the sent at the payload
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials!"});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); //if succesfull, return a token for user
        delete user.password;
        res.status(200).json({token, user});

    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}