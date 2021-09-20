const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
  },
  poster_path: {
    type: String,
  },
  vote_average: {
    type: Number,
  },
  movie_id: {
    type: Number,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  movies: [movieSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;