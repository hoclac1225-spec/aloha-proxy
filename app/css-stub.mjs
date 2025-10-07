import { createRequire } from "module";
const require = createRequire(import.meta.url);

[".css"].forEach((ext) => {
  require.extensions[ext] = () => {};
});
