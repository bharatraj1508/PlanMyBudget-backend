require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth/authRoutes");

const app = express();
const port = process.env.PORT || 3000; // Added default port

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "server is online" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
