import { Router } from "express";
import  config  from "../config/config.js";
import { usersManager } from "../DAL/daos/mongoDB/usersManagerDB.js";
import { hashData, compareData } from "../utils/utils.js";
import { generateToken } from "../utils/utils.js";
import { transporter } from "../utils/nodemailer.js"
import jwt from 'jsonwebtoken';
import passport from "passport";

const router = Router();

router.post("/signup",(req, res, next)=>{ passport.authenticate("signup", {
        successRedirect: '/api/views/login',
        failureRedirect: '/api/views/error'
        })(req, res, next)
    });
    router.post('/login', (req, res, next) => {
        const { email , password } = req.body
        passport.authenticate("login", (err, user) => {
            if (err) {
                return next(err);
            }
            if (!req) {
                return res.redirect('/api/views/signup'); 
            }
            const payload = {
                sub: user._id, 
                name: user.name,
                mail : user.email,
                role: user.role,
            };
            const token = generateToken(payload);
            const carritoUser = user.cartId;
            res.cookie('cartId', carritoUser, { maxAge: 60000, httpOnly: true });
            res.cookie('token', token, { maxAge: 60000, httpOnly: true });
            return res.redirect('/api/views/home');
        })(req, res, next);
    });

router.get("/auth/github", passport.authenticate("github", { 
    scope: ["user:email"] })
);

router.get("/callback", passport.authenticate("github"), (req, res) => {
    const payload = {
        sub: req.user._id, 
        name: req.user.name,
        mail : req.user.email,
        role: req.user.role,
    };
    const token = generateToken(payload);
    res.cookie('token', token, { maxAge: 60000, httpOnly: true });
    const carritoUser = req.user.cartId;
    res.cookie('cartId', carritoUser, { maxAge: 60000, httpOnly: true });
    res.redirect("/api/views/home");
});

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/views/error" }),
    (req, res) => {
        const payload = {
            sub: req.user._id, 
            name: req.user.name,
            mail : req.user.email,
            role: req.user.role,
        };
        const token = generateToken(payload);
        res.cookie('token', token, { maxAge: 60000, httpOnly: true });
        const carritoUser = req.user.cartId;
        res.cookie('cartId', carritoUser, { maxAge: 60000, httpOnly: true });
        res.redirect("/api/views/home");
    }
);


router.get("/signout", async (req, res) => {
    try {
        const secretKeyJwt = config.secret_jwt;        
        const token = req.cookies.token;
        const user = jwt.verify(token, secretKeyJwt);
        const userDate = await usersManager.updateOne(
            { _id: user.sub },
            { last_connection: new Date() } 
        );
        res.clearCookie('token');
        res.redirect("/api/views/login");
    } catch (error) {
        res.status(500).json({ error: 'Server internal error' });
    }
});

router.post("/restaurarviamail", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return res.redirect("/api/session/signup");
        }
        const token = jwt.sign({ email }, config.secret_jwt, { expiresIn: '2h' });
        await transporter.sendMail({
            from: "federicosegu@gmail.com",
            to: email,
            subject: "Recuperacion de contraseña",
            html: `<b>Por favor haga clic en el siguiente link para restablecer su contraseña http://localhost:8080/api/views/restaurar?token=${token} </b>`,
        });
        res.status(200).json({ success: 'Mail sent succesfully' });
    } catch (error) {
        console.error("Error sending mail:", error);
        res.status(500).json({ error: 'Server internal error' });
    }
});

router.post("/restaurar", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const token = req.cookies.tokenRest;
        const decoded = jwt.verify(token, config.secret_jwt);
        const timestampInSeconds = decoded.iat;
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimeInSeconds = timestampInSeconds + 60 * 60;
        console.log("expiration", currentTimeInSeconds > expirationTimeInSeconds);
        if (currentTimeInSeconds > expirationTimeInSeconds) {
            return res.status(403).json({ error: 'The link has expired.' });
        }
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return res.redirect("/api/session/signup");
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.redirect("/api/views/login");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server internal error.' });
    }
});


router.get('/current', passport.authenticate('current', {session: false}), async(req, res) => {
    res.status(200).json({message: 'User logged', user: req.user})  
})

export default router;