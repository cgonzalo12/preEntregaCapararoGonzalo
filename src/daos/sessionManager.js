
import usersSchema from "../../public/schemas/users.schema.js";
class sessionManager{
    static async getUser(email){
        try {
            return await usersSchema.findOne({email:email});
        } catch (error) {
            console.log("error getting user: " + error);
        }
    }
    static async getUserByCreds(email, password){
        try {
            return await usersSchema.findOne({email:email, password:password});
        } catch (error) {
            console.log("error getting user: " + error);
        }
    }

    static async insertUser(first_name, last_name, age, email, password){
        try {
            return await usersSchema.create({first_name, last_name, age, email, password});
        } catch (error) {
            console.log("error creating user: " + error);
        }
    }
    static async getUserById(id){
        try {
            return await usersSchema.findById({_id:id},{first_name:1, last_name:1, age:1, email:1}).lean();
        } catch (error) {
            console.log("error getting user: " + error);
        }
    }


}

export default sessionManager;