const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AlbumSchema = new Schema({
    name: String,
    total_tracks: Number,
    url: String
});

module.exports = mongoose.model('Albums', AlbumSchema);