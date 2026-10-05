require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const router = require("./routes/router");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

app.use("/api", router);
app.use("/api", notFound);

if (process.env.NODE_ENV === "production") {
  const dist = path.join(__dirname, "dist");
  app.use(express.static(dist));
  app.get("*", (req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});