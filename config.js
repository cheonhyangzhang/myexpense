var local_db = 'mongodb://localhost:27017/test';
// var test_db = 'mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o';
// var dev_db = 'mongodb://45.55.234.147:27017/test';

// var connect_db = test_db;
var connect_db = local_db;

//secret is very important
module.exports = {
    'secret': 'ilovescotchyscotch',
    'database': connect_db 
};