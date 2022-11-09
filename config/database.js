const mongoose = require("mongoose");

const MONGODB_URL = "secret";

exports.connect(() => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        newUnifiedTopology: true
    })
    .then(console.log(`DB CONNECTED SUCESSFULLY`))
    .catch((error) => {
        console.log(`DB CONNECTION FAILED`);
        console.log(error);
        process.exit(1);
    })
})