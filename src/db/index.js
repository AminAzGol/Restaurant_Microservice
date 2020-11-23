const Mysql = require('mysql');
var conCount = 0;

function connect() {
    var conncetion = Mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    conncetion.connect();
    conCount++
    console.log(`Connected to Database Number of connections: ${conCount}`)
    return conncetion
}

var pool = Mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(err); // not connected!
            return resolve(connection)
        })
    })
}

export class DB {

    transactionConnection;

    constructor() {}

    async _initialize() {
        if (!this.connection)
            this.connection = await getConnection()
    }

    correctQueryNulls(string) {
        /* replace all the 'null' with null */
        return string.split("'null'").join("null").split('"null"').join("null");

    }

    execQuery(query, paramsArray) {
        return new Promise((resolve, reject) => {
            let connection
            if (this.transactionConnection) {
                connection = this.transactionConnection
            } else
                connection = pool
            connection.query(query, paramsArray, (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            })
        })
    }


    generateQueryInsertOne(entry) {
        var keys = Object.keys(entry);
        keys.splice(keys.indexOf("name"), 1);
        var keyString = keys.join(",")

        var valuesString = keys.map(v => {
            var type = typeof entry[v]
            if (type === "object")
                return `'${JSON.stringify(entry[v])}'`
            return `"${entry[v]}"`
        }).join(',')
        valuesString = this.correctQueryNulls(valuesString)

        var q = `insert into ${entry.name}(${keyString}) values(${valuesString})`

        return q

    }

    generateQueryInsertMany(entryArr, variablePairs) {
        var keys = Object.keys(entryArr[0]);
        keys.splice(keys.indexOf("name"), 1);
        var keyString = keys.join(",")

        let variables = "";
        if (variablePairs.length) {
            keyString += ", " + variablePairs.map(e => `${e.key}`).join(',')
            variables = ", " + variablePairs.map(e => `${e.varName}`).join(',')
        }

        var valuesString = entryArr.map(entry => `(${keys.map(v => `"${entry[v]}"`).join(',') + variables})`).join(',')

        valuesString = this.correctQueryNulls(valuesString)

        var q = `insert into ${entryArr[0].name}(${keyString}) values ${valuesString}`

        return q
    }

    beginTransaction() {
        return new Promise((resolve, reject) => {
            // TODO: from 2 - 9:30 I waste my time on this "autocommit" commented line.
            //  let it be a lesson for the next generation.
            // this.runQuery("SET autocommit=0;").then(_ => {
                pool.getConnection((err, connection)=>{
                    this.transactionConnection = connection
                    this.transactionConnection.beginTransaction((err) => {
                        if (err) {
                            console.err(err);
                            reject(err);
                        }
                        resolve();
                    })
                })
            // })

        })

    }

    commit() {
        return new Promise((resolve, reject) => {
            if (!this.transactionConnection)
                throw new Error("No transaction to commit")
            var self = this
            let connection = this.transactionConnection
            connection.commit(function (err) {
                if (err) {
                    console.err("Commit failed")
                    connection.rollback(function () {
                        self.destroyConnection().then(()=>{
                            reject(err);
                        })
                    });
                } else {
                    self.destroyConnection().then(()=>{
                        resolve();
                    })
                }
            });

        })
    }

    rollback() {
        return new Promise((resolve, reject) => {
            if (!this.transactionConnection)
                throw new Error("No transaction to rollback")
            var self = this
            let connection = this.transactionConnection
            connection.rollback(function (err) {
                if (err) {
                    console.err("rollback failed")
                    connection.rollback(function () {
                        self.destroyConnection().then(()=>{
                            reject(err);
                        })
                    });
                } else {
                    self.destroyConnection().then(()=>{
                        resolve();
                    })
                }
            });
        })
    }

    destroyConnection() {
        if(!this.transactionConnection)
            throw new Error("There is no transaction connection to destroy")

        return new Promise((resolve,reject) => {
            this.transactionConnection.release()
            this.transactionConnection = undefined
            resolve()
        })

    }
    async insertIfNotExists(obj){
        let q = this.generateQueryInsertOne(obj)
        q = q.split(' ')
        q[0] = 'insert ignore'
        q = q.join(' ')
        let res = await this.execQuery(q)
        return res
    }
}