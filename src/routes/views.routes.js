import { Router } from "express";

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

viewsRouter.get("/profile", async(req, res) => {
  if (req.session.user) {
      let user = await sessionManager.getUserById(req.session.user);
      res.render("profile",{user});
  }else{
      res.redirect("/login");
  }
})

// Home del sitio
viewsRouter.get("/", (req, res) => {
  res.redirect("/home");
});
viewsRouter.get("/home", (req, res) => {
  res.render("home");
});

//paguina error 404
viewsRouter.use((req, res, next) => {
  res.render("404");
});

export default viewsRouter;
