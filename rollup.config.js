import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import ts from "@wessberg/rollup-plugin-ts";
import resolve from "@rollup/plugin-node-resolve";
import fs from "fs";
import path from "path";

// Treat all dependencies and peerDependencies as external (don't bundle them)
// If you want something bundled, add it to devDependencies instead
const pkg = JSON.parse(fs.readFileSync(path.resolve("./package.json"), "utf-8"));
const external = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}));

/* We use our custom styleInject function to solve CSS injection order */
const styleInjectPath = require.resolve("./src/util/styleInject.ts").replace(/[\\/]+/g, "/");

export default {
  input: {
    index: "src/index.ts",
    mocks: "src/util/mocks.ts",
  },
  output: [
    {
      dir: "dist/es",
      format: "es",
      sourcemap: true,
    },
    {
      dir: "dist/cjs",
      format: "cjs",
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
      inject: (cssVar) => `import styleInject from '${styleInjectPath}';\nstyleInject(${cssVar});`,
    }),
    ts({ transpiler: "babel" }),
  ],
  external,
};
