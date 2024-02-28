import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import jwt from "jsonwebtoken";
import { productsManager } from '../DAL/daos/mongoDB/productManagerDB.js'
import { cartsManager } from '../DAL/daos/mongoDB/cartsManagerDB.js'
import { usersManager } from '../DAL/daos/mongoDB/usersManagerDB.js'
import { Cookie } from "express-session";
import passport from "passport";
import cookieParser from 'cookie-parser';
import { generateProduct } from "../faker.js";
import config from "../config/config.js";
import { paginate } from "mongoose-paginate-v2";
import path from 'path';


const router = Router();

router.get("/home", passport.authenticate('current', { session: false }), async (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/api/views/login");
    }
    try {
        const products = await productsManager.findAll(req.query);
        const { limit  } = req.params;
        const productsFinal = products.info.results;
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const {pages, nextPage, prevPage}  = products.info;
        const sort = req.query.orders;
        const cart = await cartsManager.findCById(req.user.cartId)
        const foto = req.user.avatar.map(item => item.reference);
        const avatar = foto.map(foto => path.basename(foto));
        console.log(nextPage, prevPage, pages, "paginacion");
        res.render("home",  { avatar: avatar, cartId: req.user.cartId, uid: req.user.id, quantity: cart.totalProducts, user: req.user, name: req.user.name, email : req.user.email, products: result, sort: sort, pages : pages, limit:limit, nextPage: nextPage,  prevPage: prevPage, style: "product" } );
    } catch (error) {
        res.status(500).send("Server internal error");
    }
});

router.get("/login", (req, res) => {
        if (req.cookies.token) {    
            return res.redirect("/home", { style:"product" });
        }
    res.render("login", { style:"product" });
});

router.get("/signup", async (req, res) => {
    if (req.session.user) {    
        return res.redirect("/login", { style:"product" })    
    } 
    res.render("signup", { style:"product" })
});

router.get("/restaurarviamail", (req,res) => {
    const token = jwt.sign({}, config.secret_jwt);
    res.render("restaurarviamail", { token: token, style:"product"});
});

router.get("/restaurar", (req, res) => {
    const { token } = req.query;
    res.cookie('tokenRest', token);
    res.render("restaurar", {  token: token, style:"product" });
});

router.get("/users/:uid", (req, res) => {
    const { uid } = req.params;
    res.render("usersPerfil", { uid: uid, style: "product" });
});

router.get("/error", (req, res) => {
    res.render("error", {style:"product"});
});


router.get('/carts/:cartId', async (req, res) => {
    const { cartId } = req.params;
    
    try {
        const cart = await cartsManager.findCById(cartId);
        if (!cart) {
            return res.status(404).send('Cart not founded');
        }
        const cartProducts = cart.products.map(doc => doc.toObject());
        res.render('carts', {  token:req.cookies.token, cartId : cartId, products:cartProducts, style:"product" });
    } catch (error) {
        res.status(500).send('Server internal error');
    }
});
router.get('/carts/:cartId/purchase', async (req, res) => {
    try {
        const {cartId} = req.params;
        const cart = await cartsManager.findCById(cartId);
        res.render ('ticket', {cart: cart, cartId : cartId});
    } catch (error) {
        res.status(500).send('Server internal error');
    }});


router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const cartId = req.cookies.cartId;
        const productFound = await productsManager.findById(pid);
        const cart = await cartsManager.findCById(cartId);
        if (!productFound) {
            return res.status(404).send('Product not founded');
        }
        const clonedProduct = Object.assign({}, productFound);
        res.render("productDetail", {cartId: cartId, quantity: cart.totalProducts,  pid: pid, product: clonedProduct, style: "product" });
    } catch (error) {
        res.status(500).send('Server internal error');
    }
});


router.get("/changeproducts", async (req, res) => {
    try {
    res.render("changeproducts");
    } catch {
        error
    }
});



router.get("/realTimeProducts", authMiddleware(["admin" , "premium"]), async (req, res) => {
    try {
        const products = await productsManager.findAll({});
        const clonedProduct = products.docs.map(doc => doc.toObject());
        res.render("realTimeProducts", { products: clonedProduct, token: req.cookies.token, style: "product" });
    } catch (error) {
        res.status(500).send("Server internal error");
    }
});
router.get("/ticket", async(req,res)=>{
    const ticketFound = findticketById(req.cookies.ticketId);
    res.render("ticket", {ticket:ticketFound})
})
router.get("/chat", async (req, res) => {
    try {
        res.render("chats");
    } catch {
        error
    }
});
router.get("/mockingProducts", (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        const product = generateProduct();
        products.push(product);
    }
    res.render("mockingProducts", {products:products,style:"product"});
});
export default router;