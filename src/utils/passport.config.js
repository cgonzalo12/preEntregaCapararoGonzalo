import  LocalStrategy from "passport-local";
import  sessionManager from "../daos/sessionManager.js";
import passport from "passport";
import { createHash, isValidPassword } from "../../public/js/encryption.js";
import cartManager from "../daos/cartManager.js";
import GitHubStrategy from "passport-github2";


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


    //github passport
    passport.use(new GitHubStrategy({
        clientID: "Iv1.9fc8bf61b2041b18",
        clientSecret: "22d97560fb559361429e4a03195f399e160ac8fe",
        callbackURL: "http://localhost:8080/session/githubcallback",
        scope: ['user:email']
      },async (accessToken, refreshToken, profile, done)=>{
        try {
            let user = await sessionManager.getUserByEmail(profile._json.email);
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name:"",
                    age: 18,
                    email: profile._json.email,
                    password:"",
                }
                let result = await sessionManager.insertUser(newUser.first_name, newUser.last_name, newUser.age, newUser.email, createHash(newUser.password));
                done(null, result);
            }else{
                //si ya existe
                done(null, user);
            }
        } catch (error) {
            console.log("error getting user: " + error);
            done(error);
        }
      }
    ));


    

}


export default initializePassport;

