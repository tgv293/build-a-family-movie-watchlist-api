import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import * as db from "../utils/db.js";

const router = express.Router();


router.use(authenticate);


router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const list = db.getWatchlist(userId);

  if (list === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(list);
});


router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movie = db.addMovie(userId, req.body);

  if (!movie) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(201).json(movie);
});


router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const updatedMovie = db.updateMovie(userId, movieId, req.body);

  if (!updatedMovie) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  return res.status(200).json(updatedMovie);
});


router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const success = db.deleteMovie(userId, movieId);

  if (!success) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  return res.status(200).json({ message: "Movie removed successfully" });
});

export default router;
