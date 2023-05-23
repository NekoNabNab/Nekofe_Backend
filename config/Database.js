// sequelize
import {Sequelize} from "sequelize";

// create database connection
const db = new Sequelize('ukl_aplikasikasir','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;