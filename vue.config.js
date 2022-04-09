const path = require("path");

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],

  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, "./demo/src/main.ts"),
    },
  },

  css: { extract: false },

  chainWebpack: config => {
    config.module.rule("js").include.add(path.resolve(__dirname, "./demo"));
    // config.externals({
    //   vue: "commonjs2 vue",
    //   vuetify: "commonjs2 vuetify",
    //   "vuetify/lib": "commonjs2 vuetify/lib",
    // });
  },
});
