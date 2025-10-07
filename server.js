import { createRequestHandler } from "@remix-run/node";
import express from "express";
import path from "path";

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

// Static files
app.use("/build", express.static(path.join(process.cwd(), "public/build")));

// Remix handler
app.all(
  "*",
  createRequestHandler({
    build: await import(path.join(BUILD_DIR, "index.js"))
  })
);

const port = parseInt(process.env.PORT, 10) || 3000;
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
