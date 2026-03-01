const mongoose = require("mongoose");

function connectToDB () {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Server connected to the DB");
    })
    .catch(err=>{
        console.log("Cannot connect to DB");
        process.exit(1);
    })
}

module.exports = connectToDB;