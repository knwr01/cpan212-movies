const Movie = require("../models/Movie");

function mustBeLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

async function mustBeOwner(req, res, next) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send("Movie not found");

    if (!req.session.user) return res.redirect("/auth/login");

    if (movie.createdBy.toString() !== req.session.user._id) {
      return res.status(403).send("Not allowed");
    }

    req.movie = movie;
    next();
  } catch (err) {
    res.status(500).send("Server error");
  }
}

module.exports = { mustBeLoggedIn, mustBeOwner };