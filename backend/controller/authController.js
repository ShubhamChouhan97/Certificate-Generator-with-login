const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../controller/token");

const me = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.status(401).json({ message: "Unauthorized" });
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        console.log("gg",email);
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Unauthorized" });
    
        res.json({ user });
      } catch (error) {
        res.status(401).json({ message: "Invalid token" });
      }
    };

const register = async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User created successfully" });
    };

    const login = async (req, res) => {
        const { email, password } = req.body;
        console.log(email, password);
    
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch);
    
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
    
            const token = generateToken(user); // Assume this returns a valid JWT token
    
            res.cookie("token", token, {
                httpOnly: true,
                secure: true, // only send over HTTPS
                sameSite: "None", // required for cross-site cookie usage
                maxAge: 3600000, // 1 hour
            });
              const userData = {    
                id: user._id,
                userName: user.userName,
                email: user.email,
                };
            res.json({ message: "Logged in successfully" ,userData});
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ message: "Server error" });
        }
    };
    
    module.exports = { me, register,login };
