// import library
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

import User from "./UserModel.js";

// Implementasi Library
const {DataTypes} = Sequelize;

// Struktur Tabel Menu
const Menu = db.define('menu',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nama_menu:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    jenis:{
        type: DataTypes.ENUM('makanan','minuman'),
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    gambar:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    url:{
        type: DataTypes.STRING
    },
    harga:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName:true
});

User.hasMany(Menu);
Menu.belongsTo(User, {foreignKey: 'userId'});

export default Menu;