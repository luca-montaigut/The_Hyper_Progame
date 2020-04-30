if (process.env.NODE_ENV === "production") {
  module.exports = {
    plugins: [
      require("autoprefixer"),
      require("cssnano"),
      // Tous les modules CSS que tu souhaite
    ],
  };
}
