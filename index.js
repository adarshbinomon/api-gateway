const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const services = [
  {
    route: "/auth/user",
    target: process.env.AUTH_SERVICE_BASEURL,
  },
  {
    route: "/auth/admin",
    target: process.env.AUTH_SERVICE_ADMIN_BASEURL,
  },
  {
    route: "/user",
    target: process.env.USER_SERVICE_BASEURL,
  },
  {
    route: "/post",
    target: process.env.POST_SERVICE_BASEURL,
  },
  {
    route: "/group",
    target: process.env.GROUP_SERVICE_BASEURL,
  },
  {
    route: "/chat",
    target: process.env.CHAT_SERVICE_BASEURL,
  },
];

services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        const newPath = path.replace(/^\/api/, "");
        return newPath;
      },
    })
  );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
