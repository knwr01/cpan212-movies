const express = require("express");
const Movie = require("../models/Movie");
const { mustBeLoggedIn, mustBeOwner } = require("../middleware/auth");

const router = express.Router();

// list
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ createdAt: -1 });
  res.render("movies/list", { movies });
});

// add form (logged in only)
router.get("/add", mustBeLoggedIn, (req, res) => {
  res.render("movies/add", { errors: [], form: {} });
});

// add movie (logged in only)
router.post("/add", mustBeLoggedIn, async (req, res) => {
  const { name, description, year, genres, rating } = req.body;
  const errors = [];

  if (!name || !description || !year || !genres || !rating) errors.push("All fields are required.");
  if (Number.isNaN(Number(year))) errors.push("Year must be a number.");
  if (Number.isNaN(Number(rating))) errors.push("Rating must be a number.");

  if (errors.length) return res.render("movies/add", { errors, form: req.body });

  const movie = await Movie.create({
    name,
    description,
    year: Number(year),
    genres,
    rating: Number(rating),
    createdBy: req.session.user._id,
  });

  res.redirect(`/movies/${movie._id}`);
});

// details
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id).populate("createdBy");
  if (!movie) return res.status(404).send("Movie not found");

  const isOwner =
    req.session.user && movie.createdBy && movie.createdBy._id.toString() === req.session.user._id;

  res.render("movies/details", { movie, isOwner });
});

// edit form (owner only)
router.get("/:id/edit", mustBeLoggedIn, mustBeOwner, (req, res) => {
  res.render("movies/edit", { errors: [], form: req.movie });
});

router.post("/:id/edit", mustBeLoggedIn, mustBeOwner, async (req, res) => {
  
});

// edit submit (owner only)
router.post("/:id/edit", mustBeLoggedIn, mustBeOwner, async (req, res) => {
  const { name, description, year, genres, rating } = req.body;
  const errors = [];

  if (!name || !description || !year || !genres || !rating) errors.push("All fields are required.");

  if (errors.length) return res.render("movies/edit", { errors, form: { ...req.body, _id: req.params.id } });

  await Movie.findByIdAndUpdate(req.params.id, {
    name,
    description,
    year: Number(year),
    genres,
    rating: Number(rating),
  });

  res.redirect(`/movies/${req.params.id}`);
});

// delete (owner only) - called by JS fetch
router.delete("/:id", mustBeLoggedIn, mustBeOwner, async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;