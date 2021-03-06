// Imports for configuring Vuetify
import Vue from "vue";
import Vuetify from "vuetify";
// import VueI18n from "vue-i18n"; // <== NOTE: I usually use i18n
// import i18n from "@/i18n";

// configure Vue to use Vuetify
Vue.use(Vuetify);
// Vue.use(VueI18n);

// this was the only thing here by default
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";

const vuetify = new Vuetify();

// THIS is my decorator
export const decorators = [
  (story, context) => {
    // wrap the passed component within the passed context
    const wrapped = story(context);
    // extend Vue to use Vuetify around the wrapped component
    return Vue.extend({
      vuetify,
      //   i18n,
      components: { wrapped },
      props: {
        locale: {
          type: String,
          default: "en",
        },
      },
      watch: {
        dark: {
          immediate: true,
          handler(val) {
            this.$vuetify.theme.dark = val;
          },
        },
        locale: {
          immediate: true,
          handler(val) {
            // this.$i18n.locale = val;
          },
        },
      },
      template: `
        <v-app>
          <v-container>
            <wrapped />
          </v-container>
        </v-app>
      `,
    });
  },
];
