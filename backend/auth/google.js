const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/USerModel");
require("dotenv").config();

passport.use(
    new googleStrategy(
        {
            clientID : process.env.REACT_APP_GOOGLE_CLIENT_ID,
            clientSecret : process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
            callbackURL : "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done)=>{
            try{
            const googleId = profile.id;
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            const username = profile.displayName;
            const ProfilePic = profile.photos && profile.photos[0] && profile.photos[0].value;
            let user = await User.findOne({googleId});
            if(!user){
                user = User({
                    googleId,
                    username,
                    email,
                    ProfilePic 
                }
                )
            }
            const savedUser = await user.save();
            return done(null, savedUser);
        }catch(err){
            return done(err,null);
        }
    })
)