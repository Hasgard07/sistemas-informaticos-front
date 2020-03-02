const mysql = require('mysql');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'tauro',
    password: 'Aldebaran8503',
    database: 'introduccion_s_i'
});
con.connect();

con.query(select * from );

con.end();