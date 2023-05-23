// import library
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Implementasi Library
const {DataTypes} = Sequelize;

// Struktur Tabel User
const User = db.define('user',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama_user:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.ENUM('admin','kasir','manajer'),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName:true
});

export default User;

// (async()=>{
//     await db.sync();
// })();