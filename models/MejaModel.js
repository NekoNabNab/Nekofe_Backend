// import library
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

// Implementasi Library
const {DataTypes} = Sequelize;

// Struktur Tabel Meja
const Meja = db.define('meja',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    nomor_meja:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true,
        }
    },
    status_meja:{
        type: DataTypes.ENUM('kosong','terisi'),
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

User.hasMany(Meja);
Meja.belongsTo(User, {foreignKey: 'userId'});

export default Meja;