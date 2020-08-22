import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";

export default {
    input: {
        index: "src/index.js",
    },
    output: [
        {
            dir: "dist",
            format: "es",
            sourcemap: true,
        },
    ],
    plugins: [
        image(),
        postcss({
            extract: false,
            minimize: true,
        }),
        babel({
            exclude: "node_modules/**",
        }),
    ],
    external: ["react", "react-dom", "prop-types"],
};