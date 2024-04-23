const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  if (process.env.NODE_ENV === "production") {
    app.use(
      createProxyMiddleware({
        target:
          "https://docs.google.com/spreadsheets/d/1of1pkodGvVWOJE8vHDw7naNt8xvmPwyE284fJ7P4kRk/export?format=csv",
        changeOrigin: true,
      })
    );
  }
};
