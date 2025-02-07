module.exports = {
    "appEnv": process.env.NODE_ENV,
    "application": {
        "port": process.env.PORT,
        "isMaintenance": false,
        "maintenanceMessage": "Scheduled maintenance activity is going on, System will be available soon."
    },
    "storage": {
        "databases": {
            "mongo": {
                "database": process.env.MONGO_DB,
                "reader": process.env.MONGO_DB_READER,
                "writer": process.env.MONGO_DB_WRITER,
            }
        }
    }
}