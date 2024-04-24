import { Router } from "express";
import passport from "passport";
const viewsRouter = Router();
viewsRouter.get("/register", (req, res) => {
  res.render("register");
})

//profile con passport jwt y cookies
viewsRouter.get("/current", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.redirect("/login"); // Redirige a la página de inicio de sesión si no hay usuario autenticado
      }
      // Si el usuario está autenticado, continúa con el siguiente middleware (o manejo de la solicitud)
      req.user = user; // Agrega el usuario a la solicitud para que esté disponible en el manejador de solicitud
      next();
  })(req, res, next); // Llamada inmediata al middleware de Passport
}, (req, res) => {
  // Manejo de la solicitud si el usuario está autenticado
  let user = req.user;
  res.render("profile", { user });
});


//login con passport jwt y cookies
viewsRouter.get("/login", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.render("login"); // Redirige a la página de inicio de sesión si no hay usuario autenticado
      }
      // Si el usuario está autenticado, continúa con el siguiente middleware (o manejo de la solicitud)
      req.user = user; // Agrega el usuario a la solicitud para que esté disponible en el manejador de solicitud
      next();
  })(req, res, next); // Llamada inmediata al middleware de Passport
}, (req, res) => {
  // Manejo de la solicitud si el usuario está autenticado
  let user = req.user;
  res.render("profile", { user });
});


//home con passport jwt y cookies
viewsRouter.get("/home",(req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          return res.render("home"); // Redirige a la página de inicio de sesión si no hay usuario autenticado
      }
      // Si el usuario está autenticado, continúa con el siguiente middleware (o manejo de la solicitud)
      req.user = user; // Agrega el usuario a la solicitud para que esté disponible en el manejador de solicitud
      next();
  })(req, res, next); // Llamada inmediata al middleware de Passport
}, (req, res) => {
  // Manejo de la solicitud si el usuario está autenticado
  let user = req.user;
  if (user.rol == "admin") {
    res.render("home", { user, admin: true });
  }else{
    res.render("home", { user }) 
  };
});
viewsRouter.get("/", (req, res) => {
  res.redirect("/home");
})

// Home del sitio con jwt y cookies
// viewsRouter.get("/",authToken, async(req, res) => {
//   if (req.user) {
//     try {
//       let user = await sessionManager.getUserById(req.user._id);
//       if (user.rol == "admin") {
//         res.render("home", { user, admin: true });
//       }else{
//       res.render("home", { user }) 
//     };
//     } catch (error) {
//       console.log("error getting user: " + error);
//     }
//   }else{
//     res.redirect("/home");
//   }
// });



// viewsRouter.get("/home",authToken, async(req, res) => {
//   if (req.user) {
//     try {
//       let user = await sessionManager.getUserById(req.user._id);
//       if (user.rol == "admin") {
//         res.render("home", { user, admin: true });
//       }else{
//       res.render("home", { user }) 
//     };
//     } catch (error) {
//       console.log("error getting user: " + error);
//     }
//   }else{
//   res.render("home");
//   }
// });

//login con jwt y cookies
// viewsRouter.get("/login",authToken, (req, res) => {
//   if (req.user) {
//       res.redirect("/current");
//   }else{
//       res.render("login");
//   }
// })

//profile con jwt y cookies
// viewsRouter.get("/current",authToken, async(req, res) => {
//   if (!req.user) {
//     res.redirect("/login");
//   }else{
//     let user=req.user;
//     res.render("profile",{user});
//   }
  
// })


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
