// css-stub.mjs
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require.extensions['.css'] = () => {};
