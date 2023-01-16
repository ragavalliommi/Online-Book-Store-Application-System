const Users = require('../models/userModel')
const Orders = require('../models/orderModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userCtrl = {
 register: async (req, res) => {
        try{
            const {name, email, password, confirm_password} = req.body;
            const user = await Users.findOne({email})

            if(user) 
                return res.status(400).json({msg: "This email alreday exists."})
            
            // Checking for email ID regex pattern
            var regex_pattern = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/;
            if(!(regex_pattern.test(email)))
            {
                return res.status(400).json({msg: "Email ID is not matching conventions"})    
            }

            // Checking for password regex pattern
            var regex_pattern = /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
            if(!(regex_pattern.test(password)))
            {
                return res.status(400).json({msg: "Password is not matching conventions"}) 
            }

            // Password and  confirm password validation
            if(password != confirm_password)
            {
                return res.status(400).json({msg: "Password is not matching with above specified one"}) 
            }

            //Password Encrytion
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash
            })

            //Save mongodb
            await newUser.save()

            // Create jsonwebtoken to authentication
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({accesstoken})

        }catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    login: async (req, res) =>{
        try{
            const {email, password} = req.body;

            // Check credentials
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This user does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password entered is incorrect"})

            // If login success , create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    logout: async (req, res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out successfully"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "Please Login or Register"})
                const accesstoken = createAccessToken({id: user.id})
                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },

    getUser: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "This user does not exist."})
            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    addCart: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "This user does not exist."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Item added to cart"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    history: async(req, res) =>{
        try {
            const history = await Orders.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '11m'})
}

const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl