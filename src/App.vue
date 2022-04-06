<template>
  <v-app>
    <v-row class="py-4 px-4">
      <v-col cols="4">
        <v-toolbar color="grey" dense flat dark>
          <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>

        <v-list subheader two-line flat>
          <v-subheader>Props</v-subheader>

          <v-list-item>
            <v-switch v-model="view" label="view" class="mt-0" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="codeEditor" label="codeEditor" inset />
          </v-list-item>

          <v-list-item>
            <v-select
              :items="['html', 'css']"
              v-model="codeLanguage"
              flat
              label="codeLanguage"
            />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="htmlEditable" label="htmlEditable" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="hideToolbar" label="hideToolbar" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="inline" label="inline" inset />
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="8">
        <VTiptap
          v-model="content"
          :code-editor="codeEditor"
          :html-editable="htmlEditable"
          :hide-toolbar="hideToolbar"
          :inline="inline"
          :code-language="codeLanguage"
          :view="view"
          height="300"
        />
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import VTiptap from "./components/VTiptap";

export default {
  name: "App",
  components: {
    VTiptap,
  },

  data: () => ({
    content: "",
    codeLanguage: "html",
    codeEditor: false,
    htmlEditable: false,
    hideToolbar: false,
    view: false,
  }),
};
</script>
