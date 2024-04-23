import { Router } from "express";
import sessionManager from "../daos/sessionManager.js";
import {authToken} from "../utils/jwt.config.js";
const viewsRouter = Router();
//profile con jwt y cookies
viewsRouter.get("/current",authToken, async(req, res) => {
  if (!req.user) {
    res.redirect("/login");
  }else{
    let user=req.user;
    res.render("profile",{user});
  }
  
})
viewsRouter.get("/register", (req, res) => {
  res.render("register");
})

//login con jwt y cookies
viewsRouter.get("/login",authToken, (req, res) => {
  if (req.user) {
      res.redirect("/current");
  }else{
      res.render("login");
  }
})



// Home del sitio con jwt y cookies
viewsRouter.get("/",authToken, async(req, res) => {
  if (req.user) {
    try {
      let user = await sessionManager.getUserById(req.user._id);
      if (user.rol == "admin") {
        res.render("home", { user, admin: true });
      }else{
      res.render("home", { user }) 
    };
    } catch (error) {
      console.log("error getting user: " + error);
    }
  }else{
    res.redirect("/home");
  }
});



viewsRouter.get("/home",authToken, async(req, res) => {
  if (req.user) {
    try {
      let user = await sessionManager.getUserById(req.user._id);
      if (user.rol == "admin") {
        res.render("home", { user, admin: true });
      }else{
      res.render("home", { user }) 
    };
    } catch (error) {
      console.log("error getting user: " + error);
    }
  }else{
  res.render("home");
  }
});


//login con session
// viewsRouter.get("/login", (req, res) => {
//   if (req.session.user) {
//       res.redirect("/profile");
//   }else{
//       res.render("login");
//   }
// })

//current con session
// viewsRouter.get("/current", async(req, res) => {
//   if (req.session.user) {
//       if (req.signedCookies.user == false) {
//         res.clearCookie("user")
//       }
//       let user = await sessionManager.getUserById(req.session.user);
//       res.render("profile",{user});
//   }else{
//       res.redirect("/login");
//   }
// })

//paguina error 404
viewsRouter.use((req, res, next) => {
  res.render("404");
});

export default viewsRouter;
