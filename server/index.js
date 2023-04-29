import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path"; //for config directories
import { fileURLToPath } from "url"; //for config directories

/*CONTROLLERS*/
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";

/*ROUTES*/
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleware/auth.js";


/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

//SERVER
const app = express();

app.use(express.json());
//HELMET HELP US FOR ADDING HEADER FOR SECURITY IN OUR NODE EXPRESS SERVER
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy(true));
//MORGAN TO SAVE LOGS FOR WEB SERVER
app.use(morgan("common"));
//SET LIMIT FOR RESPONSE OF THE BODY OF REQUESTS ABOUT JSON AND URLENCODED
app.use(bodyParser.json({ limit:"30mb", extend: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extend: true }));
app.use(cors());
//SETTING FOR PUT ALL THE OBJECTS AT THE ASSETS, IN THE PUBLIC DIRECOTORY WHEN IN PROD MODE
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


/* FILE STORAGE */
//Saving Files - putting the files uploaded at the public/assets
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

//Everytime that upload the file, using the destination and filename of const storage with multer
const upload = multer({ storage });

/* ROUTES WITH FILES */
//Logic for register one user, before register that user save the picture that user send at the storage made with multer
//Call the /auth/register to do it in the backend
app.post("/auth/register", upload.single("picture"), register); 
//Permit the user public a post with a image that will go to storage
app.post("/posts", verifyToken, upload.single("picture"), createPost);


/*ROUTES*/
//For auth of users, posts and login.
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);



/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001; //PORT 6001 case has failed to obtain PORT of .env
mongoose.connect(process.env.MONGO_URL, { //connection on Mongo based on URL in .env
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => { console.log(`Server running on ${PORT}`) }); //if succesful for connect, express is listening on port of .env and print the log
}).catch((error) => console.log(`${error} did not connect`)); //print the error log if failed




