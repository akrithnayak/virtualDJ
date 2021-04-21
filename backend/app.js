require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const entryRoutes = require("./routes/entry");
const spotifyRoutes = require("./routes/spotify");
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/vitualdj/build"));
}

app.use("/", entryRoutes);
app.use("/", spotifyRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
