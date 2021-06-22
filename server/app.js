require("dotenv").config();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const entryRoutes = require("./routes/entry");
const spotifyRoutes = require("./routes/spotify");
const cors = require("cors");
const { socketHandler } = require("./controllers/socket");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_END,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

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
io.on("connection", (socket) => socketHandler(socket, io));

app.get("/reload", (req, res) =>
  res.json({
    msg: "Hey bot",
  })
);
app.use("/api", entryRoutes);
app.use("/api", spotifyRoutes);

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
