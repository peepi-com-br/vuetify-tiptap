<template>
  <v-app>
    <v-row class="py-4 px-4">
      <v-col cols="4">
        <v-toolbar color="grey" dense flat dark>
          <v-toolbar-title>vuetify-tiptap</v-toolbar-title>
        </v-toolbar>

        <v-list subheader two-line flat>
          <v-subheader>Props</v-subheader>

          <v-list-item>
            <v-switch v-model="hideToolbar" label="hideToolbar" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="view" label="view" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="inline" label="inline" inset />
          </v-list-item>

          <v-list-item>
            <v-switch
              v-model="errorMessages"
              :false-value="null"
              true-value="Error messages"
              label="errorMessages"
              inset
            />
          </v-list-item>

          <v-list-item>
            <v-select
              v-model="toolbar"
              :items="toolbarItems"
              label="toolbar"
              multiple
              persisten
            />
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="8">
        <VTiptap
          v-model="content"
          :hide-toolbar="hideToolbar"
          disable-toolbar
          :toolbar="toolbar"
          :inline="inline"
          :view="view"
          background-color="grey lighten-4"
          placeholder="Enter some text..."
          :error-messages="errorMessages"
          rounded
        >
          <template #editor="{}" v-if="editHtml">
            <v-textarea
              height="auto"
              hide-details
              v-model="content"
              flat
              solo
            />
          </template>

          <template #edit-html-btn="{}">
            <v-btn
              @click="editHtml = !editHtml"
              class="elevation-0"
              small
              :color="editHtml ? 'primary' : undefined"
              text
            >
              HTML
            </v-btn>
          </template>

          <template #clean-btn="{ editor }">
            <v-btn icon small @click="editor.commands.setContent('')">
              <v-icon>mdi-delete-circle-outline</v-icon>
            </v-btn>
          </template>

          <template #prepend>🔜</template>
          <template #append>🔚</template>
        </VTiptap>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import VTiptap from "./components/VTiptap";

import toolbarItems from "@/constants/toolbarItems";
import collect from "collect.js";

export default {
  name: "App",
  components: {
    VTiptap,
  },

  data: () => ({
    content: "<p style='text-align: center '><u>Hello World</u></p>",
    view: false,
    inline: false,
    editHtml: false,
    hideToolbar: false,
    errorMessages: null,
    toolbar: collect(toolbarItems)
      .unique()
      .push(">")
      .push("#edit-html-btn")
      .push("#clean-btn")
      .all(),
  }),

  computed: {
    toolbarItems() {
      return collect(toolbarItems)
        .unique()
        .push(">")
        .push("#edit-html-btn")
        .push("#clean-btn")
        .all();
    },
  },
};
</script>
