import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
// import { visualizer } from "rollup-plugin-visualizer";

import packageJson from "./package.json";

export default {
  input: "src/wrapper.ts",
  output: [
    {
      format: "cjs",
      file: packageJson.main,
      sourcemap: true,
    },
    {
      format: "esm",
      file: packageJson.module,
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    vue({ compileTemplate: true, css: false }),
    commonjs(),
    resolve(),
    typescript(),
    postcss(),
    // terser(),
    // visualizer(),
  ],
};
