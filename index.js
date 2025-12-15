const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();

const moviesRoutes = require("./routes/movies");
const authRoutes = require("./routes/auth");

const app = express();

// view engine
app.set("view engine", "pug");
app.set("views", __dirname + "/views");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// make session user available in pug
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// routes
app.get("/", (req, res) => res.redirect("/movies"));
app.use("/movies", moviesRoutes);
app.use("/auth", authRoutes);

// db connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));