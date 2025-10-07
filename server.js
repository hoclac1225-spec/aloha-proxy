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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
