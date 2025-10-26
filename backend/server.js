    require('dotenv').config();
    const express = require("express");
    const session = require("express-session");
    const mongoose = require("mongoose");
    const passport = require("passport");
    const jwt = require("jsonwebtoken");
    const cors = require("cors");
    const multer = require("multer");
    const bcrypt = require("bcrypt");
    const path = require("path");
    const fs = require('fs');
    const User = require("./models/USerModel")
    require("./auth/google")
    const app = express();
    const port = process.env.PORT || 5000   
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            // Sanitize filename
            const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
            cb(null, safeName);
        }
    });

    const fileFilter = (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    });

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
    // Multer error handling middleware
    const handleMulterError = (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({
                error: err.message || 'File upload error',
                code: 'UPLOAD_ERROR'
            });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json({
                error: 'Unknown upload error occurred',
                code: 'UNKNOWN_ERROR'
            });
        }
        next();
    };

    app.post("/api/register", upload.single('profilePic'), handleMulterError, async (req, res) => {
        try {
            console.log('Registration request received');
            console.log('Request body:', req.body);
            console.log('File:', req.file);

            const { username, email, password } = req.body;
            
            // Validate required fields
            if (!username || !email || !password) {
                const errorMsg = {
                    error: "All fields are required",
                    missing: {
                        username: !username,
                        email: !email,
                        password: !password
                    }
                };
                console.log('Validation error:', errorMsg);
                return res.status(400).json(errorMsg);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: "Invalid email format"
                });
            }

            // Validate password strength
            if (password.length < 6) {
                return res.status(400).json({
                    error: "Password must be at least 6 characters long"
                });
            }

            try {
                // Check if user already exists
                const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                console.log('User already exists:', {
                    email: existingUser.email,
                    username: existingUser.username
                });
                return res.status(400).json({
                    error: "Email or username already exists"
                });
            }

            // Process profile picture
            let profilePicPath = null;
            if (req.file) {
                profilePicPath = `/uploads/${req.file.filename}`;
                console.log('Profile picture saved:', profilePicPath);
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword,
                ProfilePic: profilePicPath
            });

            await user.save();
            console.log('New user created:', {
                id: user._id,
                email: user.email,
                username: user.username
            });

            // Create token
            const payload = { id: user._id, email: user.email };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key', { expiresIn: "7d" });

            // Send successful response
            return res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    ProfilePic: user.ProfilePic
                }
            });
            } catch (dbError) {
                console.error('Database operation failed:', dbError);
                return res.status(500).json({
                    error: "Failed to create user account",
                    details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
                });
            }
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


    app.listen(port,"0.0.0.0",()=>{
        console.log(`Server is running on port ${port}`);
    })
