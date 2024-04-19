import { Router } from "express";
import sessionManager from "../daos/sessionManager.js";
import { createHash, isValidPassword } from "../../public/js/encryption.js";
import passport from "passport";

const sessionRouter = Router();

//register con passport
sessionRouter.post("/register", passport.authenticate("register", { failureRedirect: "/session/failergister" }), (req, res) => {
    res.redirect("/login");
});

sessionRouter.get("/failergister", (req, res) => {
    res.redirect("/register");
})
//login con passport
sessionRouter.post("/login", passport.authenticate("login", { failureRedirect: "/session/faillogin" }), async(req, res) => {
    
    req.session.user=req.user._id;
    res.redirect("/current");
})
sessionRouter.get("/faillogin", (req, res) => {
    res.redirect("/login");
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
