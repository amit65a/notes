const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const JWT_SECRET = "Sum@N"
var fetchuser = require("../middleware/fetchuser")

//ROUTE 1: Create user using : POST "/api/auth/createuser"

router.post('/createuser',
    [
        body('name', "Enter your name correctly").isLength({ min: 3 }),
        body('email', "Enter your correct email address").isEmail(),
        body('password', "Enter correct password").isLength({ min: 5 })
    ],
    async (req, res) => {

        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        success = false;
        if (!errors.isEmpty()) {
            success = false;
            return res.status(400).json({ success, errors: errors.array() })
        }

        try {
            //check whether the user with the email id exist already or not
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                success = false;
                return res.status(400).json({ success, error: "Sorry the user already exist" })

            }

            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)

            // creating a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            //Signing Token

            const authToken = jwt.sign(data, JWT_SECRET);
            success = true
            res.json({ authToken: authToken, success })


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
)

//ROUTE 2 : Authenticating user using : POST "/api/auth/login"


router.post('/login',
    [
        body('email', "Enter your correct email address").isEmail(),
        body('password', "Password cannot be blank").exists(),
    ],
    async (req, res) => {
        let success = false;

        //if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email })
            if (!user) {
                success = false;
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                success = false
                return res.status(400).json({ success, error: "Please try to login with correct credentials" });
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.status(200).json({ success, authToken: authToken })

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error")

        }
    }
)


//ROUTE 3 : Get logged in User details using : POST "/api/auth/getuser". Login required

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
}
)



module.exports = router  