import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000; // Added default port
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "server is online" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
