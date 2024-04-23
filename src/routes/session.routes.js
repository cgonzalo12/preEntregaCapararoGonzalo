import { Router } from "express";
import passport from "passport";
import sessionManager from "../daos/sessionManager.js";
import cartManager from "../daos/cartManager.js";
import { createHash } from "../../public/js/encryption.js";
import { isValidPassword } from "../../public/js/encryption.js";
import {generateToken} from "../utils/jwt.config.js";

const sessionRouter = Router();
//register con jwt y cookies
sessionRouter.post("/register", async(req, res) => {
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
            
            await sessionManager.insertUser(first_name, last_name, age, email,createHash(password) );
            let user = await sessionManager.getUserByEmail(email);
            cartManager.add(user._id, []);
            //generamos token
            res.redirect("/login");
        }
    } catch (error) {
        console.log("error getting user: " + error);
    }
    

})

//login con jwt y cookies
sessionRouter.post("/login", async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        res.redirect("/login");
    }
    try {
        let user = await sessionManager.getUserByEmail(email);
        if (!user) {
            res.redirect("/login");
        }
        if (isValidPassword(user,password)) {
            //agrego token con el usr
            delete user.password;
            const token = generateToken(user);
            //req.session.user = user._id; // parte de session
            res.cookie("user", token,{maxAge:10000000,signed:true,httpOnly:true});
            res.redirect("/products");
            
        }else{
            res.redirect("/login");
        }
         
        
    } catch (error) {
        console.log("error getting user: " + error);
    }
    
})



//register con passport
// sessionRouter.post("/register", passport.authenticate("register", { failureRedirect: "/session/failergister" }), (req, res) => {
//     res.redirect("/login");
// });
// sessionRouter.get("/failergister", (req, res) => {
//     res.redirect("/register");
// })
// //login con passport
// sessionRouter.post("/login", passport.authenticate("login", { failureRedirect: "/faillogin" }), async(req, res) => {
//     req.session.user=req.user._id;
//     res.redirect("/products");
// })
// sessionRouter.get("/faillogin", (req, res) => {
//     res.redirect("/login");
// })




//login github con passport

sessionRouter.get("/github", passport.authenticate("github",{scope:["user:email"]}), (req, res) => {

});
sessionRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/faillogin" }), async(req, res) => {

    req.session.user=req.user._id;
    res.redirect("/products");
})


// register sin passport

// sessionRouter.post("/register", async(req, res) => {
//     let first_name = req.body.first_name;
//     let last_name = req.body.last_name;
//     let email = req.body.email;
//     let age = parseInt(req.body.age);
//     let password = req.body.password;

//     if (!first_name || !last_name || !email || !age || !password) {
//         res.redirect("/register");
//     }

//     try {
//         let emailUsed = await sessionManager.getUserByEmail(email);

//         if (emailUsed) {
         
//             res.redirect("/register");
//         }else{
//             await sessionManager.insertUser(first_name, last_name, age, email,createHash(password) );
//             let user = await sessionManager.getUserByEmail(email);
//             cartManager.add(user._id, []);
//             res.redirect("/login");
//         }
//     } catch (error) {
//         console.log("error getting user: " + error);
//     }
    

// })


//login sin passport

// sessionRouter.post("/login", async(req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;
//     if (!email || !password) {
//         res.redirect("/login");
//     }
//     try {
//         let user = await sessionManager.getUserByEmail(email);
//         if (!user) {
//             res.redirect("/login");
//         }
//         if (isValidPassword(user,password)) {
//             req.session.user = user._id;
//             res.cookie("user", user,{maxAge:10000000,signed:true});
//             res.redirect("/products");
            
//         }else{
//             res.redirect("/login");
//         }
         
        
//     } catch (error) {
//         console.log("error getting user: " + error);
//     }
    
// })

sessionRouter.get("/logout", (req, res) => {
    res.clearCookie("user")
    req.session.destroy((err)=>{
        res.redirect("/home");
    });
})


export default sessionRouter;
