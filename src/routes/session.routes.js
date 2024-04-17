import { Router } from "express";
import sessionManager from "../daos/sessionManager.js";
import cartManager from "../daos/cartManager.js";

const sessionRouter = Router();

sessionRouter.post("/register", async(req, res) => {
    console.log("ingrese");
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if (!first_name || !last_name || !email || !age || !password) {
        res.redirect("/register");
    }

    try {
        let emailUsed = await sessionManager.getUserByEmail(email);

        if (emailUsed) {
         
            res.redirect("/register");
        }else{
            await sessionManager.insertUser(first_name, last_name, age, email, password);
            let user = await sessionManager.getUserByEmail(email);
            cartManager.add(user._id, []);
            res.redirect("/login");
        }
    } catch (error) {
        console.log("error getting user: " + error);
    }
    

})
sessionRouter.post("/login", async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        res.redirect("/login");
    }
    try {
        let user = await sessionManager.getUserByCreds(email, password);
        if (!user) {
            res.redirect("/login");
        }else{
            req.session.user = user._id;
            res.cookie("user", user,{maxAge:10000000,signed:true});
            res.redirect("/products");
        }
    } catch (error) {
        console.log("error getting user: " + error);
    }
    
})

sessionRouter.get("/logout", (req, res) => {
    res.clearCookie("user")
    req.session.destroy((err)=>{
        res.redirect("/home");
    });
})


export default sessionRouter;
