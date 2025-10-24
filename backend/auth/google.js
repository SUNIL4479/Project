const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/USerModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

passport.use(
    new googleStrategy(
        {
            clientID : process.env.GOOGLE_CLIENT_ID,
            clientSecret : process.env.GOOGLE_CLIENT_SECRET,
            callbackURL : `https://smartest-2nta.onrender.com/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done)=>{
            try{
            const googleId = profile.id;
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            const username = profile.displayName;
            const ProfilePic = profile.photos && profile.photos[0] && profile.photos[0].value;
            let user = await User.findOne({googleId});
            if(!user){
                user = new User({
                    googleId,
                    username,
                    email,
                    ProfilePic
                });
            }
            const savedUser = await user.save();
            const payload = {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
            savedUser.token = token;
            await savedUser.save();
            done(null, savedUser);
            return done(null, savedUser);

        }catch(err){
            return done(err,null);
        }
    })
)
passport.serializeUser((user,done)=>{
    done(null,user.id);
})
passport.deserializeUser(async(id , done)=>{
    const user = await User.findById(id);
    done(null,user);
})