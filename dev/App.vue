<template>
  <v-app>
    <v-row class="my-3 px-4">
      <v-col cols="4">
        <v-toolbar
          :color="$vuetify.theme.dark ? undefined : 'grey lighten-4'"
          dense
          flat
        >
          <v-toolbar-title>vuetify-tiptap</v-toolbar-title>
        </v-toolbar>

        <v-list
          :color="$vuetify.theme.dark ? undefined : 'grey lighten-5'"
          subheader
          two-line
          flat
        >
          <v-subheader>Props</v-subheader>

          <v-list-item>
            <v-switch v-model="$vuetify.theme.dark" label="dark" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="hideToolbar" label="hideToolbar" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="disableToolbar" label="disableToolbar" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="view" label="view" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="mention" label="mention" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="outlined" label="outlined" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="dense" label="dense" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="slotPrepend" label="slotPrepend" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="slotAppend" label="slotAppend" inset />
          </v-list-item>

          <v-list-item>
            <v-switch v-model="slotBottom" label="slotBottom" inset />
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
              v-model="$vuetify.icons.iconfont"
              :items="['mdi', 'fa', 'md']"
              label="icons"
              persisten
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
          :disable-toolbar="disableToolbar"
          :toolbar="toolbar"
          :outlined="outlined"
          :dense="dense"
          :mention="mention"
          :view="view"
          :mention-items="mentionItems"
          :dark="$vuetify.theme.dark"
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
              @click="
                editHtml = !editHtml;
                disableToolbar = !disableToolbar;
              "
              class="elevation-0"
              small
              :color="editHtml ? 'primary' : undefined"
              text
            >
              HTML
            </v-btn>
          </template>

          <template #clean-btn="{ editor }">
            <v-btn
              icon
              small
              @click="
                editor.commands.setContent('');
                content = '';
              "
            >
              <v-icon>mdi-delete-circle-outline</v-icon>
            </v-btn>
          </template>

          <template v-if="slotPrepend" #prepend>🔜</template>
          <template v-if="slotAppend" #append>🔚</template>
          <template v-if="slotBottom" #bottom="{ editor }">
            <v-toolbar
              dense
              flat
              height="48px"
              color="grey lighten-4"
              class="px-2"
              style="border-top: 1px solid #ddd"
            >
              <v-spacer />
              <v-btn
                @click="
                  editor.commands.setContent('');
                  content = '';
                "
                icon
                small
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </v-toolbar>
          </template>

          <!-- <template #image="{ editor, imageSrc }">
            <v-text-field
              :value="imageSrc"
              name="src"
              @input="editor.chain().focus().setImage({ src: $event }).run()"
              label="Link URL"
              :placeholder="'image'"
              hide-details
            />
          </template> -->
        </VTiptap>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import VTiptap from "../src/components/VTiptap.vue";
import fetch from "node-fetch";
import testHtml from "@/constants/testHtml";
import toolbarItems from "@/constants/toolbarItems";

export default {
  name: "App",
  components: {
    VTiptap,
  },

  data: () => ({
    content: testHtml,
    view: false,
    mention: true,
    outlined: true,
    dense: false,
    editHtml: false,
    hideToolbar: false,
    disableToolbar: false,
    errorMessages: null,
    toolbar: undefined,
    slotPrepend: false,
    slotAppend: false,
    slotBottom: false,
  }),

  computed: {
    toolbarItems() {
      return toolbarItems;
    },
  },

  methods: {
    mentionItems: async function (query) {
      const response = await fetch(
        `https://dummyjson.com/users/search?q=${query}`,
        {}
      ).then(res => res.json());

      return response.users
        .map(u => ({
          value: u.id,
          text: u.username,
          avatar: u.image,
        }))
        .slice(0, 5);
    },
  },
};
</script>
