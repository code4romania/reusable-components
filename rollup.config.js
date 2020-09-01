import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: {
    index: "src/index.ts",
  },
  output: [
    {
      dir: "dist",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
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
    }),
  ],
  external: ["react", "react-dom", "prop-types"],
};
