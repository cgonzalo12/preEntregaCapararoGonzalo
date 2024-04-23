import jwt from "jsonwebtoken";

//clave privada
const PRIVATE_KEY = "PrivateKeyForJWT";

export const generateToken= (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "4h"});
    return token;
}

export const authToken= (req, res,next) => {
    try {
        const autHeader = req.signedCookies.user;
        if (!autHeader) {
            return next();
        }
        const validPayload = jwt.verify(autHeader, PRIVATE_KEY);
        req.user=validPayload.user;
        next();
    } catch (error) {
        console.log("error token: " + error);
    }  
}
