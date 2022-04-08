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

  chainWebpack: (config) => {
    config.module.rule("js").include.add(path.resolve(__dirname, "./demo"));
    config.externals({
      vue: "Vue",
      vuetify: "Vuetify",
      "vuetify/lib": "Vuetify",
    });
  },
});
