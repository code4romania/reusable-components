import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import fs from "fs";
import path from "path";

// Treat all dependencies and peerDependencies as external (don't bundle them)
// If you want something bundled, add it to devDependencies instead
const pkg = JSON.parse(fs.readFileSync(path.resolve("./package.json"), "utf-8"));
const external = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}));

export default {
  input: {
    index: "src/index.ts",
  },
  output: [
    {
      dir: "dist",
      entryFileNames: "[name].mjs",
      format: "es",
      sourcemap: true,
    },
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ browser: true }),
    image(),
    postcss({
      extract: false,
      minimize: true,
      autoModules: true,
      use: ["sass"],
    }),
    typescript(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
  ],
  external,
};
