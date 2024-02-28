import multer from "multer";
import { __dirname } from "../utils/utils.js"


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("multerrrrrrrrrr");
        if (file.fieldname === "profiles") {
        return cb(null, `${__dirname}/public/docs/profiles`);
        } else if (file.fieldname === "products") {
        return cb(null, `${__dirname}/public/docs/products`);
        } else {
        return cb(null, `${__dirname}/public/docs/documents`);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        //cb(null, file.fieldname + "-" + uniqueSuffix);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

export default upload;