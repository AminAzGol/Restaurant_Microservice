const {DB} = require("./index")
const db = new DB()
const dbName = process.env.DB_NAME

module.exports.runSchemaCreator = async function() {
    /* Restaurant Table */
    await addTableIfNotExists('restaurant')
    await addColumnIfNotExists('restaurant', 'id', 
    `int auto_increment,
	constraint restaurant_pk
		primary key (id)`)
    await addColumnIfNotExists('restaurant', `created_at`, 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP')
    await addColumnIfNotExists('restaurant', `name`, 'varchar(100) DEFAULT NULL')
    await addColumnIfNotExists('restaurant', `is_open`, 'bool null DEFAULT false')

    /* Menu Item table */
    await addTableIfNotExists('menu_item')
    await addColumnIfNotExists('menu_item', 'id', 
    `int auto_increment,
	constraint restaurant_pk
        primary key (id)`)
    await addColumnIfNotExists('menu_item', 'restaurant_id', `int not null`)
    await addColumnIfNotExists('menu_item', `name`, 'varchar(100) DEFAULT NULL')
    await addColumnIfNotExists('menu_item', `amount`, 'int DEFAULT 0')
    await addColumnIfNotExists('menu_item', `description`, 'varchar(300) DEFAULT null')
}

async function addColumnIfNotExists(tableName, columnName, columnType) {
    // check if column exists
    var res = await db.execQuery(`
        SELECT NULL
            FROM INFORMATION_SCHEMA.COLUMNS
           WHERE table_name = '${tableName}'
             AND table_schema = '${dbName}'
             AND column_name = '${columnName}'
    `)
    if (res.length > 0)
        return "Column exists"
    else {
        var q = `ALTER TABLE ${tableName} ADD ${columnName} ${columnType};`
        await db.execQuery(q)
        console.log(`Column ${columnName} added to table ${tableName}`)
        return "Column added"
    }
}

async function modifyColumnType(tableName, columnName, columnType) {
    // check if column exists
    var res = await db.execQuery(`
        SELECT NULL
            FROM INFORMATION_SCHEMA.COLUMNS
           WHERE table_name = '${tableName}'
             AND table_schema = '${dbName}'
             AND column_name = '${columnName}'
    `)
    if (res.length > 0) {
        var q = `ALTER TAB
        LE ${tableName} MODIFY COLUMN ${columnName} ${columnType};`
        await db.execQuery(q);
        return "Column altered"
    } else {
        return "Column not exists"
    }
}

async function addTableIfNotExists(tableName) {
    // check if column exists
    var res = await db.execQuery(`
        SELECT NULL
            FROM INFORMATION_SCHEMA.COLUMNS
           WHERE table_name = '${tableName}'
             AND table_schema = '${dbName}'
    `)
    if (res.length > 0)
        return "Table exists"
    else {
        var q = `CREATE TABLE ${tableName} (
                  id int NOT NULL AUTO_INCREMENT,
                  PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
        await db.execQuery(q)
        return "Table added"
    }
}