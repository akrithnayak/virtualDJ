require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const entryRoutes = require("./routes/entry");
const cors = require("cors");

const app = express();
console.log(process.env.DATABASE);
mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected!!");
  })
  .catch((err) => {
    console.log("Error connecting db!!", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.use("/", entryRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
