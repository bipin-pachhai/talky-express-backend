const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// const data = require("../models/ServerData");
const User = require("../models/userSchema");
//add to env:

const test = async (req, res) => {
    console.log("test route called");
    res.send("hello world!");
};

//ACCOUNT
//LOGIN
const postLogin = async (request, response) => {
    console.log("Login route called");

    try {
        const { token } = request.body;
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // verify token

        const userId = decodedToken.subject;
        const user = await User.findById(userId).exec();
        console.log("User authenticated: " + user.email);

        response.status(200).json({ token: token }); // send token back to client
    } catch (error) {
        console.log("Error verifying token:", error);
        response.status(401).json({ message: "Invalid token" });
    }
};

//register
const postRegister = async (req, res) => {
    //  console.log("SIGN UP route called");
    console.log(req.body);

    const secretKey = crypto.randomBytes(32).toString("hex");
    console.log("SecretKey:" + secretKey);
    var hmac = crypto.createHmac("sha256", secretKey);

    let { email, password } = req.body;

    hmac.update(email);
    const hashedEmail = hmac.digest("hex");

    hmac = crypto.createHmac("sha256", secretKey); // create a new HMAC object for the password
    hmac.update(password);
    const hashedPassword = hmac.digest("hex");

    try {
        // Check if the email is in use
        const existingUser = await User.findOne({ email: hashedEmail }).exec();

        if (existingUser) {
            return res.status(409).send({ message: "Email is already in use." });
        }

        const newUser = new User({ email: hashedEmail, password: hashedPassword }); //create new user instance
        const document = await newUser.save();
        if (!document) {
            return res.status(401).json({ message: "SignUp unsucessful!" });
        }
        const payload = { subject: document._id };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
        const expirationDate = new Date(Date.now() + 3600 * 1000);

        console.log(token);
        res.status(200).json({ token, expirationDate });
        console.log(`Sigup successful:\nHashed pw: ${hashedPassword}\nHashed Email: ${hashedEmail}`);
    } catch (error) {
        console.log("Error making user accnt" + error);
        return res.status(401).json({ message: "SignUp unsucessful!" });
    }
};

const postCheckToken = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the token against the secret key or certificate
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Check if the token has expired
        const expirationDate = new Date(decodedToken.exp * 1000);
        const currentDate = new Date();
        if (currentDate >= expirationDate) {
            return res.status(401).send({ error: "Token has expired" });
        }

        // If the token is valid and has not expired, return a success response
        res.status(200).send({ isValid: true, expirationDate: expirationDate });
    } catch (error) {
        // If there's an error verifying the token, return an error response
        console.log("Error verifying token:", error);
        res.status(401).send({ error: "Invalid token" });
    }
};

module.exports = { test, postLogin, postRegister, postCheckToken };