const express = require("express")
var cors = require("cors")
const connectToMongo = require("./db")

connectToMongo();
const app = express()
app.use(cors())

const port = 5000
app.use(express.json())
app.use("/test", (req, res) => {
    res.json("Hello guys")
})
app.use("/api/auth", require('./routes/auth'))
app.use("/api/notes", require('./routes/notes'))
app.listen(port, () => {
    console.log(`iNotebook is listening at https://localhost:${port}`);
})