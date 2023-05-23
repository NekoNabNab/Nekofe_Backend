// import library
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

import Menu from "./MenuModel.js";
import Transaksi from "./TransaksiModel.js";

// Implementasi Library
const {DataTypes} = Sequelize;

// Struktur Tabel User
const DetailTransaksi = db.define('detail_transaksi',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    transaksiId:{
        type: DataTypes.INTEGER
    },
    menuId:{
        type: DataTypes.INTEGER
    },
    harga:{
        type: DataTypes.INTEGER
    },
    jumlah:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

Menu.hasMany(DetailTransaksi);
DetailTransaksi.belongsTo(Menu, {
    foreignKey: 'menuId'
});

export default DetailTransaksi;

// (async()=>{
//     await db.sync();
// })();