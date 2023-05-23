// import library
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

import User from "./UserModel.js";
import Meja from "./MejaModel.js"
import DetailTransaksi from "./DetailTransaksiModel.js";

// Implementasi Library
const {DataTypes} = Sequelize;

// Struktur Tabel User
const Transaksi = db.define('transaksi',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    tgl_transaksi:{
        type: DataTypes.DATE
    },
    userId:{
        type: DataTypes.INTEGER
    },
    mejaId:{
        type: DataTypes.INTEGER
    },
    nama_pelanggan:{
        type: DataTypes.STRING
    },
    status_transaksi:{
        type: DataTypes.ENUM('belum_bayar','lunas')
    }
},{
    freezeTableName:true
});

User.hasMany(Transaksi);
Transaksi.belongsTo(User, {
    foreignKey: 'userId'
});

Meja.hasMany(Transaksi);
Transaksi.belongsTo(Meja, {
    foreignKey: 'mejaId'
});
Transaksi.hasMany(DetailTransaksi);
DetailTransaksi.belongsTo(Transaksi, {
    foreignKey: 'transaksiId',
    onDelete: "CASCADE"
});

export default Transaksi;

// (async()=>{
//     await db.sync();
// })();