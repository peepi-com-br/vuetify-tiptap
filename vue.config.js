module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/v-tiptap/" : "/",
  outputDir: "dist_demo",
  pages: {
    index: {
      entry: "dev/serve.ts",
      template: "dev/index.html",
      title: "VTiptap",
    },
  },
  transpileDependencies: ["vuetify"],
};
