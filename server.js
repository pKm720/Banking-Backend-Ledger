require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/db");

connectToDB();

app.listen(process.env.PORT_ENV, () => {
    console.log("Server is running on port 3000");
})