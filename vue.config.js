const path = require("path");

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],

  configureWebpack: {
    entry: {
      app: path.resolve(__dirname, "./demo/src/main.ts"),
    },
  },

  chainWebpack: (config) => {
    config.module.rule("js").include.add(path.resolve(__dirname, "./demo"));
  },
});
