import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import vue from "rollup-plugin-vue";
import buble from "@rollup/plugin-buble";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import alias from "@rollup/plugin-alias";
import { join } from "path";
const srcDir = join(__dirname, "src");

export default {
  input: "src/wrapper.js",
  external: ["vue", "vue-class-component"],
  output: {
    name: "VTiptap",
    exports: "named",
  },
  plugins: [
    typescript(),
    babel({
      exclude: ["src/**/*.scss", "node_modules/**"],
    }),
    alias({
      resolve: [".ts", ".js", ".vue"],
      "@": srcDir,
    }),
    vue({
      css: true,
      defaultLang: { script: "ts" },
      compileTemplate: true,
    }),
    peerDepsExternal(),
    commonjs(),
    resolve({
      mainFields: ["module", "jsnext", "main", "browser"],
      extensions: [".ts", ".js", ".vue", ".json"],
    }),

    buble({
      modules: true,
      exclude: "src/*",
    }),
  ],
};
