const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");

// --------- USERS ROUTES ------------
const usersRouter = require("./routes/users/allUsers");
const registerRouter = require("./routes/users/register");
const loginRouter = require("./routes/users/login");
const likeSongRouter = require("./routes/users/likeSong");
const unlikeSongRouter = require("./routes/users/unlikeSong");
const getLikedSongsRouter = require("./routes/users/getLikedSongs");

// --------- ARTISTS ROUTES ------------
const addArtistRouter = require("./routes/artists/addArtist");
const artistsRouter = require("./routes/artists/allArtists");
const deleteArtistRouter = require("./routes/artists/deleteArtist");
const getArtistByIdRouter = require("./routes/artists/getArtistById");
const updateArtistRouter = require("./routes/artists/updateArtist");

// --------- SONGS ROUTES ------------

const getSongsRouter = require("./routes/songs/allSongs");
const addSongRouter = require("./routes/songs/addSong");
const uploadSongRouter = require("./routes/songs/uploadSong");
const getSongsByArtistIdRouter = require("./routes/songs/getSongsByArtistId");
const getSongsByAlbumIdRouter = require("./routes/songs/getSongsByAlbumId");
const updateSongRouter = require("./routes/songs/updateSong");
const deleteSongRouter = require("./routes/songs/deleteSong");

// --------- ALBUMS ROUTES ------------
const addAlbumRouter = require("./routes/albums/addAlbum");
const getAlbumsRouter = require("./routes/albums/allAlbums");
const deleteAlbumRouter = require("./routes/albums/deleteAlbum");
const getAlbumByIdRouter = require("./routes/albums/getAlbumById");
const getAlbumsByArtistIdRouter = require("./routes/albums/getAlbumsByArtistId");
const updateAlbumRouter = require("./routes/albums/updateAlbum");

// --------- RECOMMENDATIONS ROUTES ------------
const addRecommendationRouter = require("./routes/recommendations/addRecommendation");
const getRecommendationsRouter = require("./routes/recommendations/getRecommendations");
const deleteRecommendationRouter = require("./routes/recommendations/deleteRecommendation");
const newReleasesRouter = require("./routes/recommendations/getNewReleases");

const searchRouter = require("./routes/search");

const uploadImageRouter = require("./routes/uploadImage");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/likeSong", likeSongRouter);
app.use("/unlikeSong", unlikeSongRouter);
app.use("/getLikedSongs", getLikedSongsRouter);

app.use("/search", searchRouter);

app.use("/addArtist", addArtistRouter);
app.use("/artists", artistsRouter);
app.use("/deleteArtist", deleteArtistRouter);
app.use("/artist", getArtistByIdRouter);

app.use("/uploadImage", uploadImageRouter);
app.use("/uploads", express.static("uploads"));
app.use("/updateArtist", updateArtistRouter);

app.use("/songs", getSongsRouter);
app.use("/addSong", addSongRouter);
app.use("/uploadSong", uploadSongRouter);
app.use("/songsByArtistId", getSongsByArtistIdRouter);
app.use("/songsByAlbumId", getSongsByAlbumIdRouter);
app.use("/updateSong", updateSongRouter);
app.use("/deleteSong", deleteSongRouter);

app.use("/addAlbum", addAlbumRouter);
app.use("/albums", getAlbumsRouter);
app.use("/deleteAlbum", deleteAlbumRouter);
app.use("/album", getAlbumByIdRouter);
app.use("/albumsByArtistId", getAlbumsByArtistIdRouter);
app.use("/updateAlbum", updateAlbumRouter);

app.use("/addRecommendation", addRecommendationRouter);
app.use("/recommendations", getRecommendationsRouter);
app.use("/deleteRecommendation", deleteRecommendationRouter);
app.use("/newReleases", newReleasesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
