import { userModel } from "../model/userSchema.js";
import { } from 'dotenv/config';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


var user = { user: null, otp: null };
var emailOfTheUserForReset = null;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 630,
    secure: true,
    auth: {
        user: process.env.DEV_EMAIL,
        pass: process.env.PASSWORD,
    },
});

const otpGenerator = () => {
    return Math.floor(Math.random() * 9000) + 1000;
}

const createToken = id => { return jwt.sign({ id }, process.env.TOKEN_KEY, { expiresIn: '1d' }); }

export const authControllers = {
    //signupDataSubmission
    signupDataSubmission: async (req, res, next) => {
        const { username, email, password } = req.body;
        try {
            const isAlreadyUser = await userModel.findOne({ email: email });
            if (!isAlreadyUser) {
                let otp = otpGenerator();
                user = { user: req.body, otp: otp };
                let info = await transporter.sendMail({
                    from: process.env.DEV_EMAIL,
                    to: email,
                    subject: "Your OTP for registration is:",
                    html: "<h3>OTP for account verification is </h3>" +
                        "<h1 style='font-weight:bold;'>" +
                        otp +
                        "</h1>",
                });
                res.status(200).json({ status: true, message: `otp sen't to your account` })
            } else {
                res.json({ status: false, message: `email already registered!` })
            }
        } catch (err) {
            res.json({ status: false, message: `something went wrong! try again` })
            throw err;
        }
    },

    //otp verification
    verifyOTP: async (req, res, next) => {
        try {
            const otpFromClient = req.body.otp;
            const userData = user.user;
            const otp = user.otp;
            if (otp == otpFromClient) {
                const createUser = await userModel.create(userData);
                const token = createToken(createUser._id);
                user = null;
                res.status(200).json({ status: true, message: null, token: token })
            } else {
                res.json({ status: false, message: `enter currect OTP` });
            }
        } catch (err) {
            throw err;
        }
    },

    //resentOTp
    resentOtp: async (req, res, next) => {
        try {
            const { email } = user.user;
            let otp = otpGenerator();
            user.otp = otp;
            let info = await transporter.sendMail({
                from: process.env.DEV_EMAIL,
                to: email,
                subject: "Your OTP for registration is--",
                html: "<h3>OTP for account verification is </h3>" +
                    "<h1 style='font-weight:bold;'>" +
                    otp +
                    "</h1>",
            });
            res.status(200).json({ status: true, message: 'otp sent!' })
        } catch (err) {
            res.json({ status: false, message: `couldn't send otp try again` })

        }
    },

    //login validation
    loginDataAuthentication: async (req, res, next) => {
        try {
            const { email, password } = req.headers;
            const isUser = await userModel.findOne({ email: email, password: password });
            if (isUser == null) res.json({ status: false, message: `email or password incurrect` })
            else res.json({ status: true, message: null, token: createToken(isUser._id) });
        } catch (err) { res.json({ status: false, message: `OOPS! try again!` }) }
    },

    verifyEmailForResetPassword: async (req, res, next) => {
        try {
            const { email } = req.headers
            const isUser = await userModel.findOne({ email: email });
            if (isUser) {
                let info = await transporter.sendMail({
                    from: process.env.DEV_EMAIL,
                    to: email,
                    subject: "Reset Password",
                    html: "<h3>Verify your email for reset password</h3>" +
                        "<a href='http://localhost:3000/resetpass'><button style='width:30%;background: #005a9dfa;padding: 0.5rem;border-radius: 40px;color: white;border: none;'>verify</button></a>",
                });
                emailOfTheUserForReset = email;
                res.status(200).json({ status: true, message: null })
            } else { res.json({ status: false, message: `couldn't find email try again!` }) }
        } catch (error) {
            res.json({ status: false, message: `couldn't verify email try again!` })
        }
    },

    updateNewPassword: async (req, res, next) => {
        try {

            const { updateNewPassword } = req.body;
            if (emailOfTheUserForReset) {
                const updatePassword = await userModel.updateOne({ email: emailOfTheUserForReset }, { password: updateNewPassword });
                console.log(updateNewPassword)
                res.json({ status: true, message: null });
            } else {
                res.json({ status: false, message: `something wen't wrong try again!` })
            }
            emailOfTheUserForReset = null;
        } catch (err) {
            res.json({ status: false, message: `something wen't wrong try again!` })
            emailOfTheUserForReset = null;
            throw err;
        }
    },

    verifyEmailSentOrNot: (req, res, next) => {
        if (user.user === null) {
            res.json({ isAllowed: false })
        }
    },

    getUserDetails: async (req, res, next) => {
        const userId = req.body;
        const isUser = await userModel.findOne({ _id: userId });
        if (isUser) res.json({ status: true, userDetails: isUser });
    },

}


