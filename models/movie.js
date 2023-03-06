// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
MovieSchema = new Schema({
  plot: "String",
  genres: ["String"],
  runtime: "Number",
  rated: "String",
  cast: ["String"],
  num_mflix_comments: "Number",
  poster: "String",
  title: "String",
  metacritic: "Number",
  fullplot: "String",
  languages: ["String"],
  countries: ["String"],
  released: "Date",
  directors: ["String"],
  writers: ["String"],
  awards: {
    wins: "Number",
    nominations: "Number",
    text: "String"
  },
  lastupdated: "Date",
  year: "Number",
  imdb: {
    rating: "Number",
    votes: "Number",
    id: "Number"
  },
  type: "String",
  tomatoes: {
    viewer: {
      rating: "Number",
      numReviews: "Number",
      meter: "Number"
    },
    dvd: "Date",
    critic: {
      rating: "Number",
      numReviews: "Number",
      meter: "Number"
    },
    lastUpdated: "Date",
    boxOffice: "String",
    website: "String",
    consensus: "String",
    rotten: "Number",
    production: "String",
    fresh: "Number"
  }
});

module.exports = mongoose.model('Movie', MovieSchema);