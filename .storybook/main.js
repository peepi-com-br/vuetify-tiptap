const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-storysource",
  ],
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config, { configType }) => {
    // so I can import { storyFactory } from '~storybook/util/helpers'
    config.resolve.alias["~storybook"] = path.resolve(__dirname);
    // the @ alias points to the `src/` directory, a common alias
    // used in the Vue community
    config.resolve.alias["@"] = path.resolve(__dirname, "..", "src");

    // THIS is the tricky stuff!
    // config.module.rules.push({
    //   test: /\.sass$/,
    //   use: [
    //     "style-loader",
    //     "css-loader",
    //     {
    //       loader: "sass-loader",
    //       options: {
    //         sassOptions: {
    //           indentedSyntax: true,
    //         },
    //         prependData: "@import '@/sass/variables.sass'",
    //       },
    //     },
    //   ],
    //   include: path.resolve(__dirname, "../"),
    // });

    // return the updated Storybook configuration
    return config;
  },
};
