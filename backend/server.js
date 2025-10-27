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
    const Contest = require("./models/ContestModel")
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

    // Contest Routes
    app.post("/contests", auth, async (req, res) => {
        try {
            console.log('Received contest creation request:', req.body);
            const { title, description, startTime, endTime, problems } = req.body;

            // Detailed validation
            const validationErrors = [];
            if (!title) validationErrors.push('Title is required');
            if (!description) validationErrors.push('Description is required');
            if (!startTime) validationErrors.push('Start time is required');
            if (!endTime) validationErrors.push('End time is required');
            if (!problems || !Array.isArray(problems)) validationErrors.push('Problems array is required');
            if (problems && problems.length === 0) validationErrors.push('At least one problem is required');

            if (validationErrors.length > 0) {
                console.log('Validation errors:', validationErrors);
                return res.status(400).json({
                    error: "Validation failed",
                    details: validationErrors
                });
            }

            // Validate dates
            const startDateTime = new Date(startTime);
            const endDateTime = new Date(endTime);
            const now = new Date();

            if (isNaN(startDateTime.getTime())) {
                return res.status(400).json({
                    error: "Invalid start time format"
                });
            }

            if (isNaN(endDateTime.getTime())) {
                return res.status(400).json({
                    error: "Invalid end time format"
                });
            }

            if (endDateTime <= startDateTime) {
                return res.status(400).json({
                    error: "End time must be after start time"
                });
            }

            // Create contest with proper schema mapping
            const contest = new Contest({
                title,
                description,
                startTime: startDateTime,
                endTime: endDateTime,
                problems: problems.map(problem => ({
                    title: problem.title,
                    description: problem.description,
                    inputFormat: problem.inputFormat,
                    outputFormat: problem.outputFormat,
                    constraints: problem.constraints,
                    sampleInput: problem.sampleInput,
                    sampleOutput: problem.sampleOutput,
                    testCases: problem.testCases.map(tc => ({
                        input: tc.input,
                        output: tc.output
                    }))
                })),
                createdBy: req.user._id // Match the schema field name
            });

            console.log('Attempting to save contest:', contest);
            await contest.save();
            console.log('Contest created successfully:', contest._id);

            res.status(201).json({
                success: true,
                contest: {
                    id: contest._id,
                    title: contest.title,
                    startTime: contest.startTime,
                    endTime: contest.endTime
                }
            });
        } catch (error) {
            console.error('Contest creation error:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    error: "Validation failed",
                    details: Object.values(error.errors).map(err => err.message)
                });
            }
            res.status(500).json({
                error: "Failed to create contest",
                message: error.message
            });
        }
    });

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
        if(!token) return res.status(401).json({message : "No token provided"});
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            if(err) return res.status(403).json({message : "Invalid token"});
            req.user = user;
            next();
        });
    }
    app.get("/api/profile", authenticateToken, async (req,res)=>{
        try{
            const user = await User.findById(req.user.id).select("-password -__v");
            if(!user) return res.status(404).json({message : "User not found"});
            res.json(user);
        }catch(err){
            console.error("Profile fetch error:", err);
            res.status(500).json({message : "Server error"});
        }
    })
    // Get Contests Created by User
    app.get("/api/contests/created", auth, async (req, res) => {
        try {
            const contests = await Contest.find({ createdBy: req.user._id })
                .sort({ createdAt: -1 })
                .select('title description startTime endTime problems createdAt');

            const formattedContests = contests.map(contest => ({
                id: contest._id,
                name: contest.title,
                description: contest.description,
                startTime: contest.startTime,
                endTime: contest.endTime,
                problemsCount: contest.problems.length,
                createdAt: contest.createdAt
            }));

            res.json(formattedContests);
        } catch (error) {
            console.error("Error fetching created contests:", error);
            res.status(500).json({ error: "Error fetching contests" });
        }
    });

    // Get Scheduled Contests (future contests)
    app.get("/api/contests/scheduled", async (req, res) => {
        try {
            const now = new Date();
            const contests = await Contest.find({
                startTime: { $gt: now }
            })
            .populate('createdBy', 'username')
            .sort({ startTime: 1 })
            .select('title description startTime endTime problems createdBy');

            const formattedContests = contests.map(contest => ({
                id: contest._id,
                name: contest.title,
                description: contest.description,
                date: contest.startTime.toISOString().split('T')[0],
                time: contest.startTime.toTimeString().slice(0, 5),
                duration: Math.round((contest.endTime - contest.startTime) / (1000 * 60 * 60)) + ' hours',
                problemsCount: contest.problems.length,
                createdBy: contest.createdBy?.username || 'Unknown'
            }));

            res.json(formattedContests);
        } catch (error) {
            console.error("Error fetching scheduled contests:", error);
            res.status(500).json({ error: "Error fetching contests" });
        }
    });

    // Get Running Contests (currently active contests)
    app.get("/api/contests/running", async (req, res) => {
        try {
            const now = new Date();
            const contests = await Contest.find({
                startTime: { $lte: now },
                endTime: { $gte: now }
            })
            .populate('createdBy', 'username')
            .sort({ startTime: 1 })
            .select('title description startTime endTime problems createdBy');

            const formattedContests = contests.map(contest => ({
                id: contest._id,
                name: contest.title,
                description: contest.description,
                startTime: contest.startTime,
                endTime: contest.endTime,
                problemsCount: contest.problems.length,
                createdBy: contest.createdBy?.username || 'Unknown'
            }));

            res.json(formattedContests);
        } catch (error) {
            console.error("Error fetching running contests:", error);
            res.status(500).json({ error: "Error fetching contests" });
        }
    });

    // Create Contest Route
    app.post("/contests", auth, async (req, res) => {
        try {
            const { title, description, startTime, endTime, problems } = req.body;

            // Validate required fields
            if (!title || !description || !startTime || !endTime) {
                return res.status(400).json({ error: "Title, description, start time, and end time are required" });
            }

            // Validate date formats and logic
            const start = new Date(startTime);
            const end = new Date(endTime);
            const now = new Date();

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: "Invalid date format" });
            }

            if (start >= end) {
                return res.status(400).json({ error: "Start time must be before end time" });
            }

            if (start <= now) {
                return res.status(400).json({ error: "Start time must be in the future" });
            }

            // Validate problems array
            if (!Array.isArray(problems) || problems.length === 0) {
                return res.status(400).json({ error: "At least one problem is required" });
            }

            // Validate each problem
            for (let i = 0; i < problems.length; i++) {
                const problem = problems[i];
                if (!problem.title || !problem.description) {
                    return res.status(400).json({ error: `Problem ${i + 1}: Title and description are required` });
                }
                if (!Array.isArray(problem.testCases) || problem.testCases.length === 0) {
                    return res.status(400).json({ error: `Problem ${i + 1}: At least one test case is required` });
                }
                // Validate test cases
                for (let j = 0; j < problem.testCases.length; j++) {
                    const testCase = problem.testCases[j];
                    if (!testCase.input || !testCase.output) {
                        return res.status(400).json({ error: `Problem ${i + 1}, Test Case ${j + 1}: Input and output are required` });
                    }
                }
            }

            // Create new contest
            const contest = new Contest({
                title,
                description,
                startTime: start,
                endTime: end,
                problems,
                createdBy: req.user._id
            });

            await contest.save();

            res.status(201).json({
                message: "Contest created successfully",
                contest: {
                    id: contest._id,
                    title: contest.title,
                    description: contest.description,
                    startTime: contest.startTime,
                    endTime: contest.endTime,
                    problems: contest.problems,
                    createdBy: contest.createdBy,
                    createdAt: contest.createdAt
                }
            });
        } catch (error) {
            console.error("Error creating contest:", error);
            res.status(500).json({ error: "Error creating contest" });
        }
    });

    // Get Contest by ID Route
    app.get("/api/contests/:id", auth, async (req, res) => {
        try {
            const contest = await Contest.findById(req.params.id);
            if (!contest) {
                return res.status(404).json({ error: "Contest not found" });
            }

            // Check if contest has started
            const now = new Date();
            if (now < contest.startTime) {
                return res.status(403).json({ error: "Contest has not started yet" });
            }

            res.json({
                _id: contest._id,
                title: contest.title,
                description: contest.description,
                startTime: contest.startTime,
                endTime: contest.endTime,
                problems: contest.problems.map(problem => ({
                    title: problem.title,
                    description: problem.description,
                    inputFormat: problem.inputFormat,
                    outputFormat: problem.outputFormat,
                    constraints: problem.constraints,
                    sampleInput: problem.sampleInput,
                    sampleOutput: problem.sampleOutput,
                    testCases: problem.testCases // Include test cases for judging
                })),
                createdBy: contest.createdBy,
                createdAt: contest.createdAt
            });
        } catch (error) {
            console.error("Error fetching contest:", error);
            res.status(500).json({ error: "Error fetching contest" });
        }
    });

    // Submit Code Route
    app.post("/api/contests/:contestId/submit", auth, async (req, res) => {
        try {
            const { problemIndex, code, language } = req.body;

            if (problemIndex === undefined || !code || !language) {
                return res.status(400).json({ error: "Problem index, code, and language are required" });
            }

            const contest = await Contest.findById(req.params.contestId);
            if (!contest) {
                return res.status(404).json({ error: "Contest not found" });
            }

            // Check if contest is active
            const now = new Date();
            if (now < contest.startTime || now > contest.endTime) {
                return res.status(403).json({ error: "Contest is not active" });
            }

            if (problemIndex < 0 || problemIndex >= contest.problems.length) {
                return res.status(400).json({ error: "Invalid problem index" });
            }

            const problem = contest.problems[problemIndex];

            // Simple code execution simulation (in a real app, you'd use a judge system)
            let status = "Wrong Answer";
            try {
                // For demo purposes, we'll just check if the code contains certain keywords
                // In a real implementation, you'd run the code against test cases
                if (code.includes("console.log") || code.includes("print")) {
                    status = "Accepted";
                }
            } catch (error) {
                status = "Runtime Error";
            }

            res.json({
                message: "Code submitted successfully",
                status,
                problemIndex,
                language
            });
        } catch (error) {
            console.error("Error submitting code:", error);
            res.status(500).json({ error: "Error submitting code" });
        }
    });

    app.listen(port,"0.0.0.0",()=>{
        console.log(`Server is running on port ${port}`);
    })
