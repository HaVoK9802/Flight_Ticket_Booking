const {Pool} = require('pg');
const path = require('path');
const pgConfig = require(path.join(__dirname,"..","config","postgre.json"));
const pool = new Pool({
    user: pgConfig.user,
    password: pgConfig.password,
    database: pgConfig.database,
    host:pgConfig.host,
    port:pgConfig.port
});

module.exports = pool;