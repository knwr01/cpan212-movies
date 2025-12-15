const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// GET register
router.get("/register", (req, res) => {
  res.render("auth/register", { errors: [], form: {} });
});

// POST register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || !email || !password) errors.push("All fields are required.");
  if (password && password.length < 6) errors.push("Password must be at least 6 characters.");

  if (errors.length) return res.render("auth/register", { errors, form: req.body });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.render("auth/register", { errors: ["Email already exists."], form: req.body });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email: email.toLowerCase(), passwordHash });

  req.session.user = { _id: user._id.toString(), username: user.username, email: user.email };
  res.redirect("/movies");
});

// GET login
router.get("/login", (req, res) => {
  res.render("auth/login", { errors: [], form: {} });
});

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !password) errors.push("All fields are required.");
  if (errors.length) return res.render("auth/login", { errors, form: req.body });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.render("auth/login", { errors: ["Invalid email or password."], form: req.body });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.render("auth/login", { errors: ["Invalid email or password."], form: req.body });

  req.session.user = { _id: user._id.toString(), username: user.username, email: user.email };
  res.redirect("/movies");
});

// logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

module.exports = router;