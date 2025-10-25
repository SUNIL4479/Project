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
    
    // Enhanced CORS configuration for deployment
    app.use(cors({
        origin: [
            process.env.FRONTEND_URL,
            'https://project-eta-pink.vercel.app',
            'http://localhost:3000'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400 // Cache preflight requests for 24 hours
    }));
    app.use(session({
        secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    // Serve uploaded files
    app.use('/uploads', express.static('uploads'));

    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser : true,
        useUnifiedTopology: true
    }).then(()=>console.log("MongoDB Connected")).catch(err=>{console.log("Mongodb connection failed"); process.exit(1)})
    app.get("/",(req,res)=>{
        res.send("Hello World!")
    })
    app.get("/auth/google", passport.authenticate("google",{scope:["profile","email"], prompt: "select_account"}))
    app.get("/auth/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }),
        async (req, res) => {
            try {
                const { token, user } = req.user;
                // Redirect to frontend with token
                res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
            } catch (error) {
                console.error("Callback error:", error);
                res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
            }
        }
    );

    // Protected route for getting user profile
    const auth = require('./middleware/auth');
    
    app.get("/api/profile", auth, async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            console.error("Profile fetch error:", error);
            res.status(500).json({ error: "Error fetching profile" });
        }
    });

    // Update profile route
    app.put("/api/profile", auth, upload.single('profilePic'), async (req, res) => {
        try {
            const updates = req.body;
            
            // If profile picture was uploaded
            if (req.file) {
                updates.ProfilePic = '/uploads/' + req.file.filename;
            }

            // Remove sensitive fields
            delete updates.password;
            delete updates.googleId;

            const user = await User.findByIdAndUpdate(
                req.user._id,
                { $set: updates },
                { new: true, runValidators: true }
            ).select('-password');

            res.json(user);
        } catch (error) {
            console.error("Profile update error:", error);
            res.status(500).json({ error: "Error updating profile" });
        }
    });

    // Regular login route
    app.post("/api/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const payload = { id: user._id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    ProfilePic: user.ProfilePic
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Error during login" });
        }
    });

    // Registration route
    app.post("/api/register", upload.single('profilePic'), async (req, res) => {
        try {
            const { username, email, password, college } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    error: "Email or username already exists" 
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword,
                college,
                ProfilePic: req.file ? '/uploads/' + req.file.filename : undefined
            });

            await user.save();

            // Create token
            const payload = { id: user._id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    ProfilePic: user.ProfilePic
                }
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Error during registration" });
        }
    });
                
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