import  LocalStrategy from "passport-local";
import  sessionManager from "../daos/sessionManager.js";
import passport from "passport";
import { createHash, isValidPassword } from "../../public/js/encryption.js";
import cartManager from "../daos/cartManager.js";


const initializePassport = () => {
    passport.use("register",new LocalStrategy(
        {passReqToCallback:true,usernameField:"email" },async(req, username, password, done) => {
        const { first_name, last_name, age,email } = req.body;
        if (!first_name || !last_name || !username || !age || !password) {
            return done(null,false);
        }

        try {
            let emailUsed = await sessionManager.getUserByEmail(username);
            if (emailUsed) {
                console.log("user already exists");
                return done(null,false);
            }else{
                await sessionManager.insertUser(first_name, last_name, age, username,createHash(password) );
                let user = await sessionManager.getUserByEmail(username);
                cartManager.add(user._id, []);
                return done(null,user);
            }
        } catch (error) {
            console.log("error getting user: " + error);
        }
        
    }))

        passport.use("login",new LocalStrategy({usernameField:"email" }, async( username, password, done) => {
            console.log(username, password);
            if (!username || !password) {
                return done(null,false);
            }
            try {
                let user = await sessionManager.getUserByEmail(username);
                if (!user) {
                    console.log("user dosnt exist");
                    return done(null,false);
                }
                if (isValidPassword(user,password)) {
                    // res.cookie("user", user,{maxAge:10000000,signed:true});
                    return done(null,user);
                    
                }else{
                    return done(null,false);
                }
            } catch (error) {
                console.log("error getting user: " + error);
            }
            // passport.serializeUser((user, done) => {
            //     done(null, user._id);
            // })
            // passport.deserializeUser(async(id, done) => {
            //     let user = await sessionManager.getUserById(id);
            //     done(null, user);
            // })



        }))


        passport.serializeUser((user, done)=> {
            done(null, user._id);
          });
          
          passport.deserializeUser(async(id, done)=> {
            try {
                let user = await sessionManager.getUserById(id);
                done(null, user);
            } catch (error) {
                
            }
            
          });

}


export default initializePassport;

