    require('dotenv').config();
    const express = require("express")
    const session = require("express-session");
    const mongoose = require("mongoose");
    const passport = require("passport");
    const jwt = require("jsonwebtoken");
    const cors = require("cors");
    const multer = require("multer");
    const bcrypt = require("bcrypt");
    const path = require("path");
    const User = require("./models/USerModel")
    require("./auth/google")
    const app = express();
    const port = process.env.PORT || 5000   
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });

    app.use(express.json());
    app.use(cors({
        origin : process.env.FRONTEND_URL,
        credentials : true
    }))
    app.use(express.json());
    app.use(session({
        secret : process.env.GOOGLE_CLIENT_SECRET,
        resave : false,
        saveUninitialized : false,
    }))
    app.use(passport.initialize());
    app.use(passport.session());

    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser : true,
        useUnifiedTopology: true
    }).then(()=>console.log("MongoDB Connected")).catch(err=>{console.log("Mongodb connection failed"); process.exit(1)})
    app.get("/",(req,res)=>{
        res.send("Hello World!")
    })
    app.get("/auth/google", passport.authenticate("google",{scope:["profile","email"], prompt: "select_account"}))
    app.get("/auth/google/callback", passport.authenticate("google",{session:false, failureRedirect : (process.env.FRONTEND_URL+"/login")}),
       async (req, res) => {
        try{
            const payload = {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.redirect(`${process.env.FRONTEND_URL}/Home?token=${token}`);
            console.log("Google authentication successful, redirecting to frontend with token");
        }catch(err){console.error("Error during Google authentication callback:", err);}        
    }    
);
    function authenticateToken(req,res,next){
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1] || req.query.token;
        if(!token) return res.sendStatus(401).json({message : "No token provided"});
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) return res.sendStatus(403).json({message : "Invalid token"});
            req.user = user;
            next();
        });
    }
    app.get("/profile", authenticateToken, async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).select("-__v");
            if(!user) return res.status(404).json({message : "User not found"});
            res.json(user);
        }catch(err){
            res.status(500).json({message : "Server error"});
        }
    })

    app.post("/api/register", upload.single('profilePic'), async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const profilePic = req.file ? req.file.path : null;

            // Check if user already exists
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({
                googleId : "",
                username,
                email,
                password: hashedPassword,
                ProfilePic: profilePic
            });

            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });
    app.post("/api/login", async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Generate JWT token
            const payload = { id: user._id, username: user.username, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.json({ message: "Login successful", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });

    app.post("/api/google-login", async (req, res) => {
        try {
            const { googleId, username, email, profilePic } = req.body;

            // Check if user already exists by googleId
            let user = await User.findOne({ googleId });
            if (!user) {
                // Create new user
                user = new User({
                    googleId,
                    username,
                    email,
                    ProfilePic: profilePic
                });
                await user.save();
            }

            // Generate JWT token
            const payload = { id: user._id, username: user.username, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.json({ message: "Google login successful", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });
    app.listen(port,"0.0.0.0",()=>{
        console.log(`Server is running on port ${port}`);
    })