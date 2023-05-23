// import library
import express from "express"; // import library express
import cors from "cors"; 
import SequelizeStore from "connect-session-sequelize"; 

// autentikasi login
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js"; // import db async

import fileUpload from "express-fileupload"; // file upload

// Import Router
import MenuRoute from "./routes/MenuRoute.js";
import MejaRoute from "./routes/MejaRoute.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import TransaksiRoute from "./routes/TransaksiRoute.js";
import DetailTransaksiRoute from "./routes/DetailTransaksiRoute.js";


// creat tabel with sequelize
// import Transaksi from "./models/TransaksiModel.js";
// import DetailTransaksi from "./models/DetailTransaksiModel.js";
// import Meja from "./models/MejaModel.js";
// import Menu from "./models/MenuModel.js";
// import User from "./models/UserModel.js";

//implementasi db
// (async()=>{
//     await db.sync();
// })();

dotenv.config();

// implementasi library
const app = express(); //implementasi library express
const sessionStore = SequelizeStore(session.Store); //session untuk sinkronisasi ketika server berhenti

// agar saat server mati tetap login
const store = new sessionStore({
    db: db
});

// inisialisasi session store
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

// inisialisasi cors
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(fileUpload());
app.use(express.static("public")); //agar folder public static (bisa ditampilkan di browser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// inisialisasi router
app.use(MenuRoute);
app.use(MejaRoute);
app.use(UserRoute);
app.use(AuthRoute);
app.use(TransaksiRoute);
app.use(DetailTransaksiRoute);

// store.sync(); //perintah create table session

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server run on port 3000');
});