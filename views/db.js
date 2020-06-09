const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./ws.db')

db.serialize(function () {

    //criar a tabela
    db.run("CREATE TABLE IF NOT EXISTS ideas")

    //inserir dado na tabela

    //consultar dados na tabela
})