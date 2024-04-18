import { Router } from "express";
import sessionManager from "../daos/sessionManager.js";

const viewsRouter = Router();

viewsRouter.get("/register", (req, res) => {
  res.render("register");
})


viewsRouter.get("/login", (req, res) => {
  if (req.session.user) {
      res.redirect("/profile");
  }else{
      res.render("login");
  }
})

viewsRouter.get("/current", async(req, res) => {
  if (req.session.user) {
      if (req.signedCookies.user == false) {
        res.clearCookie("user")
      }
      let user = await sessionManager.getUserById(req.session.user);
      res.render("profile",{user});
  }else{
      res.redirect("/login");
  }
})

// Home del sitio
viewsRouter.get("/", async(req, res) => {
  if (req.session.user) {
    try {
      let user = await sessionManager.getUserById(req.session.user);
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



viewsRouter.get("/home", async(req, res) => {
  if (req.session.user) {
    try {
      let user = await sessionManager.getUserById(req.session.user);
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

//paguina error 404
viewsRouter.use((req, res, next) => {
  res.render("404");
});

export default viewsRouter;
