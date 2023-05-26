import express from 'express';
import { authControllers } from '../controllers/authControllers.js';
import jwt from 'jsonwebtoken';
export const router = express.Router();


// token verifiation middlewear.
const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    try {
        const decode = await jwt.verify(token, process.env.TOKEN_KEY);
        req.body = decode.id;
        next();
    } catch (err) {
        res.json({ status: false, userDetails: null })
    }
}


router.post('/signup', authControllers.signupDataSubmission);
router.get('/resentotp', authControllers.resentOtp);
router.post('/verifyotp', authControllers.verifyOTP);
router.get('/login', authControllers.loginDataAuthentication);
router.get('/verifyemail', authControllers.verifyEmailForResetPassword);
router.post('/updatepassword', authControllers.updateNewPassword);
router.get('/verifyresetpage', authControllers.verifyEmailSentOrNot);
router.get('/getuserdetails', verifyToken, authControllers.getUserDetails);

router.post('/googlesignup',authControllers.signupWithGoogle);