import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);
export const createHash = (password) => bcrypt.hashSync(password, salt);
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
