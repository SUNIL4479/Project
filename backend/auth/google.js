const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/USerModel");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URI}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("✅ Google profile received:", profile?.id, profile?.emails?.[0]?.value);

      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0]?.value,
            ProfilePic: profile.photos?.[0]?.value,
          });
          console.log("🆕 New user created:", user.email);
        }

        const payload = { id: user._id, username: user.username, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        user.token = token;
        console.log("✅ User authenticated successfully:", user.email);
        done(null,{token, user});
      } catch (err) {
        console.error("❌ Google Strategy Error:", err);
        done(err, null);
      }
    }
  )
);

