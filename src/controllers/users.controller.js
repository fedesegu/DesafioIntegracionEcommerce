import { findByEmail, findById, createOne, updateUser, updatePerfilDoc, deleteOneUser, updatePerfilFoto } from "../service/user.service.js";
import { jwtValidation } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";
import CustomError from "../errors/errors.generate.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";


export const findUserById = (req, res) => {
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { idUser } = req.params;
        const user = await findById(idUser);
        if (!user) {
                return CustomError.generateError(ErrorMessages.USER_NOT_EXIST,404,ErrorName.USER_NOT_EXIST);
            }
        res.json({ message: "User", user });
}};

export const findUserByEmail = async (req, res) => {
    const { UserEmail } = req.body;
    const user = await findByEmail(UserEmail);
    if (!user) {
        return CustomError.generateError(ErrorMessages.USER_NOT_EXIST,404,ErrorName.USER_NOT_EXIST);

    }
    res.status(200).json({ message: "User found", user });
};

export const createUser =  async (req, res) => {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password || !role) {
        return CustomError.generateError(ErrorMessages.ALL_FIELDS_REQUIRED,400,ErrorName.ALL_FIELDS_REQUIRED);

    }
    const createdUser = await createOne(req.body);
    res.status(200).json({ message: "User created", user: createdUser });
};



export const updateUserNow = async (req, res) => {
    const { uid } = req.params;
    const { role, email } = req.body;
    try {        
    const userToUpdate = await findById(uid);
 
    console.log(userToUpdate.documents[0], "por Dios");
    if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
    }

    if ( userToUpdate.role === role) {
        return res.status(400).json({ message: "Your role is the same as the one you want to change" });
    }
    if (role === "premium") {
        if (!userToUpdate.documents[0] || !userToUpdate.documents[1] || !userToUpdate.documents[2]) {
            return res.status(400).json({ message: "Please update your documentation first" });
        }
    }
    if (userToUpdate._doc.email !== email ){
        return res.status(400).json({ message: "The information provided are incorrect" });
    }
    if (userToUpdate.role !== role) {
        const newUser = { ...userToUpdate._doc, role: role };
        console.log(newUser, "new user");
        const updatedUser = await updateUser(uid, newUser);
        res.status(200).json({ message: "User updated", user: updatedUser });
        } else {
            res.status(400).json({ message: "Nothing has changed" });
        }
    }
    catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

export const updatePerfil = async (req,res) => {
    const { uid } = req.params;
    try {
        const user = await findById(uid);
        const dni = req.files.dni;
        const address = req.files.address;
        const bank = req.files.bank;
        console.log(dni, address, bank, "ok");
        const response = await updatePerfilDoc(uid, { dni, address, bank });
        res.status(201).json({ message: "Documents add" });
    } catch (error) {
        res.status(500).json({ message: "Server internal error" });
    }
}  
export const deleteOneUsers = async (req, res) => {
    const {id} = req.body;
    const user = await findById(id);
    const ahora = new Date();
    const diferenciaEnDias = (ahora - user.last_connection) / (1000 * 60 * 60 * 24);
    if (diferenciaEnDias >= 2 ) {
        const userdelete = await deleteOneUser(id);
        await transporter.sendMail({
            from: "federico_segu@gmail.com",
            to: email,
            subject: "Perfil",
            html: `<b>Su usuario se ha borrado de la plataforma</b>`,
        });
        return userdelete
    } else {
        return error
    }    
};   
export const updateFoto = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await findById(uid);
        const foto = req.files.profiles;
        const response = await updatePerfilFoto(uid, {foto})
        console.log(response, "foto agregada");
        res.status(201).json({ message: "Photo add" });
    } catch (error) {
        res.status(500).json({ message: "Server internal error" });
    }
}