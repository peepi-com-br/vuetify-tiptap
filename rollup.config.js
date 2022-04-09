import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import vue from "rollup-plugin-vue";
import postcss from "rollup-plugin-postcss";
import { babel } from "@rollup/plugin-babel";
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
      exports: "named",
    },
    {
      format: "esm",
      file: packageJson.module,
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    //
    typescript(),
    vue(),
    // vue({ compileTemplate: true, css: false, target: "node" }),
    //
    commonjs(),
    postcss(),

    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    }),
    // terser({}),
    // visualizer(),
  ],
};
