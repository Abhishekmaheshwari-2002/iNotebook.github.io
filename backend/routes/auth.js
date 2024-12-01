const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require
    ("express-validator");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SEC = "Abhiisagood$boy"
// Route 1 : create a user using  : POST "/api/auth/createuser " - No login required
router.post("/createuser", [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    // if there are,return bad request and the errors 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    // check whether the user exist or not
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "the user already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, JWT_SEC)
        // res.json(user);
        success = true;
        res.json({ success, authtoken });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("some error ocurred");
    }
})

// Route 2 : Authenticate a user : POST "/api/auth/login " - No login required
router.post("/login", [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password can not be blank").exists(),
], async (req, res) => {
    let success = false;

    // if there are,return bad request and the errors 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false;
            return res.status(400).json({ error: "User does not exist" })
        }

        const pwCompare = await bcrypt.compare(password, user.password);
        success = true;
        if (!pwCompare) {
            success = false;
            return res.status(400).json({ success, error: "User does not exist" })
        }
        const data = {
            user: {
                id: user.id,
            }
        }
        const authtoken = jwt.sign(data, JWT_SEC);
        res.json({ success, authtoken });

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("some error ocurred");
    }
})


// Route 3 : Get login user Detail usingPOST "/api/auth/getuser " - login required
router.post("/getuser", fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("some error ocurred");
    }
})

module.exports = router;






























































































































































































