<template>
  <div class="v-tiptap" :class="{ dense, view }">
    <!-- View mode -->
    <div v-if="view !== false" v-html="cleanValue" style="width: 100%" />
    <!-- Edit Mode -->
    <template v-else>
      <label v-if="label" class="v-label">{{ label }}</label>
      <v-input
        class="simple outside-label"
        style="padding-top: 0px !important"
        v-bind="$attrs"
        hide-details="auto"
      >
        <v-card
          flat
          :outlined="outlined"
          :dark="dark"
          style="width: 100%"
          v-bind="$attrs"
          :style="{
            borderColor: $attrs['error-messages'] ? '#ff5252' : undefined,
          }"
        >
          <!-- Toolbar -->
          <v-toolbar
            v-if="!hideToolbar && toolbar && toolbar.length"
            dense
            flat
            :color="dark ? undefined : 'grey lighten-4'"
            height="auto"
            class="py-1"
          >
            <template v-for="(item, key) in items">
              <!-- Spacer -->
              <v-spacer v-if="item.type === 'spacer'" :key="`spacer-${key}`" />
              <!-- Divider -->
              <div
                v-else-if="item.type === 'divider'"
                class="divider"
                :key="`divider-${key}`"
              />
              <!-- Slot -->
              <div v-else-if="item.type === 'slot'" :key="`slot-${key}`">
                <slot
                  :name="item.slot"
                  v-bind="{ editor, disabled: disableToolbar }"
                />
              </div>
              <!-- Buttons -->
              <div v-else :key="`button-${key}`">
                <v-tooltip :open-delay="500" top>
                  <span>{{ item.title }}</span>
                  <template v-slot:activator="{ on, attrs }">
                    <!-- Headings -->
                    <div v-if="item.type === 'headings'" class="ml-n1">
                      <v-select
                        v-model="selectedHeading"
                        :disabled="disableToolbar"
                        :items="headingsItems"
                        :menu-props="{ dark: dark }"
                        :dark="dark"
                        dense
                        hide-details="auto"
                        style="width: 104px"
                        :data-testid="item.type"
                      />
                    </div>

                    <!-- Color Button -->
                    <div v-else-if="item.title === 'Color'" class="mr-1">
                      <ColorPicker
                        v-model="selectedColor"
                        @input="item.action(selectedColor)"
                        v-bind="attrs"
                        v-on="on"
                        :dark="dark"
                        :more="false"
                        :nudge-top="-4"
                        :nudge-left="8"
                      >
                        <template #button="{ on }">
                          <v-btn
                            v-on="on"
                            :disabled="disableToolbar"
                            icon
                            small
                            style=""
                            :data-testid="item.type"
                          >
                            <v-icon
                              :style="{
                                'border-bottom': selectedColorBorder,
                                height: '18px',
                                top: '2px',
                                width: '20px',
                              }"
                            >
                              mdi-format-color-text
                            </v-icon>
                          </v-btn>
                        </template>
                      </ColorPicker>
                    </div>

                    <!-- Standard Button -->
                    <v-btn
                      v-else
                      :disabled="disableToolbar"
                      :class="{
                        'v-btn--active': item.isActive && item.isActive(),
                      }"
                      :color="
                        item.isActive && item.isActive() ? 'primary' : undefined
                      "
                      v-bind="attrs"
                      v-on="on"
                      @click="item.action"
                      class="mr-1"
                      icon
                      small
                      :data-testid="item.type"
                    >
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>
          </v-toolbar>

          <div class="d-flex">
            <!-- Slot Prepend -->
            <slot name="prepend" v-bind="{ editor }" />
            <!-- Tiptap Editor -->
            <slot name="editor" v-bind="{ editor }">
              <editor-content
                :editor="editor"
                class="flex-grow-1"
                :class="editorClass"
                data-testid="value"
              />
            </slot>
            <!-- Slot Append -->
            <slot name="append" v-bind="{ editor }" />
          </div>

          <slot name="bottom" v-bind="{ editor }" />
        </v-card>

        <!-- Dialogs -->
        <ImageDialog
          :value="selectedImage"
          :show="imageDialog"
          :dark="dark"
          @close="imageDialog = false"
          :uploadImage="defaultUploadImage"
          @apply="editor.chain().focus().setImage({ src: $event }).run()"
        />

        <LinkDialog
          :value="selectedLink"
          :show="linkDialog"
          :dark="dark"
          @close="linkDialog = false"
          @apply="
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: $event })
              .run()
          "
        />

        <VideoDialog
          :value="selectedVideo"
          :show="videoDialog"
          :dark="dark"
          @close="videoDialog = false"
          @apply="editor.chain().focus().setIframe({ src: $event }).run()"
        />

        <!-- Mention -->
        <v-menu
          v-model="mention.show"
          dense
          absolute
          :position-x="mention.x"
          :position-y="mention.y"
          offset-y
          max-height="220px"
          class="items"
        >
          <v-list dense>
            <v-list-item
              class="item"
              :style="{
                background: index === mention.selected ? '#EEE' : undefined,
              }"
              v-for="(item, index) in mention.items"
              :key="item.text"
              @click="selectMention(index)"
            >
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-input>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { Editor, EditorContent, AnyExtension } from "@tiptap/vue-2";
import TiptapKit from "../plugins/tiptap-kit";
import vuetify from "../plugins/vuetify";

import { getOption } from "../utils/options";

import * as components from "./components";
import EmojiPicker from "./EmojiPicker.vue";

import toolbarItems from "../constants/toolbarItems";
import makeToolbarDefinitions from "../constants/toolbarDefinitions";
import { renderSuggestion } from "../constants/suggestion";

import xss from "xss";
import xssRules from "../constants/xssRules";

@Component({
  components: {
    EditorContent,
    ...components,
  },
})
export default class extends Vue {
  @Prop({ default: "" }) readonly value: string | null;

  // Appearance
  @Prop({ default: false }) readonly view: boolean;

  @Prop({ default: false }) readonly dark: boolean;

  @Prop({ default: false }) readonly dense: boolean;

  @Prop({ default: true }) readonly outlined: boolean;

  @Prop({ default: false }) readonly disabled: boolean;

  @Prop() readonly label: string | null;

  @Prop() readonly placeholder: string | null;

  // Toolbar
  @Prop({ default: () => toolbarItems }) readonly toolbar: string[];

  @Prop({ default: false }) readonly hideToolbar: boolean;

  @Prop({ default: false }) readonly disableToolbar: boolean;

  // xss
  @Prop({ default: true }) readonly xss: boolean | string[];

  @Prop({ default: () => xssRules })
  readonly xssOptions: Record<string, string[]>;

  // Editor
  @Prop({ default: () => [] }) readonly extensions: AnyExtension[];

  @Prop() readonly editorClass: string | string[] | object;

  editor: Editor | null = null;

  get cleanValue() {
    if (this.xss === false) {
      return this.value;
    }

    const value = this.value
      .replace("https://youtu.be/", "https://www.youtube.com/watch?v=")
      .replace("watch?v=", "embed/")
      .replace("https://vimeo.com/", "https://player.vimeo.com/video/");

    let whiteList = this.xssOptions;
    if (Array.isArray(this.xssOptions)) {
      whiteList = this.xss.reduce((acc, rule) => {
        acc[rule] = this.xssOptions[rule];
        return acc;
      }, {});
    }

    return xss(value, { whiteList });
  }

  get items() {
    return makeToolbarDefinitions(this);
  }

  created() {
    this.editor = new Editor({
      content: this.value,
      editorProps: {
        handleKeyDown: this.handleKeyDown,
      },
      onSelectionUpdate: this.onSelectionUpdate,
      onUpdate: this.onUpdate,
      extensions: [
        TiptapKit.configure({
          bold: {},
          blockquote: {
            HTMLAttributes: {
              class: "blockquote",
            },
          },
          history: {
            depth: 10,
          },
          heading: {
            levels: [1, 2, 3],
          },
          placeholder: {
            placeholder: () => this.placeholder || "",
          },
          textAlign: {
            types: ["heading", "paragraph"],
          },
          focus: {
            className: "focus",
          },
          color: {},
          highlight: { multicolor: true },
          image: {},
          link: {
            openOnClick: false,
          },
          taskList: {
            HTMLAttributes: {
              class: "task-list",
            },
          },
          taskItem: {
            HTMLAttributes: {
              itemTypeName: "task-list",
            },
          },
          textStyle: {},
          underline: {},
          video: {},
          mention: this.mentionItems
            ? {
                HTMLAttributes: {
                  class: "mention",
                },
                suggestion: {
                  items: ({ query }) => {
                    return this.mentionItems
                      .filter(item =>
                        item.text.toLowerCase().startsWith(query.toLowerCase())
                      )
                      .slice(0, 5);
                  },
                  render: renderSuggestion(this),
                },
              }
            : false,
        }),
        ...this.extensions,
      ],
      autofocus: false,
      editable: true,
      injectCSS: true,
    });
  }

  @Watch("value")
  onValueChanged(value) {
    const code = this.editor.getHTML();
    if (code === value) {
      return;
    }

    this.editor.commands.setContent(value);
  }

  @Watch("disabled")
  onDisabledChanged(disabled) {
    this.editor.setEditable(!disabled);
  }

  beforeDestroy() {
    this.editor.destroy();
  }

  //
  handleKeyDown(view, event) {
    if (event.key === "Enter" && this.$listeners.enter && !event.shiftKey) {
      this.$emit("enter");

      return true;
    }

    return false;
  }

  onSelectionUpdate({ editor }) {
    // Color
    const { color } = editor.getAttributes("textStyle");
    this.selectedColor = color;

    // Heading
    this.selectedHeading = this.getHeading();
  }

  onUpdate({ editor }) {
    this.$emit("input", editor.getHTML());
  }

  // --- Features --- //

  // Alignment
  selectedAlignment = "left";

  @Watch("selectedAlignment")
  onAlignmentChanged(newValue, oldValue) {
    if (newValue === oldValue || newValue === this.getAlignment()) {
      return;
    }

    this.editor.chain().focus().setTextAlign(newValue).run();
  }

  getAlignment() {
    if (this.editor.isActive({ textAlign: "left" })) {
      return "left";
    }

    if (this.editor.isActive({ textAlign: "center" })) {
      return "center";
    }

    if (this.editor.isActive({ textAlign: "right" })) {
      return "right";
    }

    if (this.editor.isActive({ textAlign: "justify" })) {
      return "justify";
    }

    return "left";
  }

  // Color
  selectedColor = null;

  get selectedColorBorder() {
    let opacity = !this.disableToolbar ? "0.67" : "0.2";

    if (this.selectedColor) {
      let color = `${this.selectedColor}`;
      if (color[0] === "r") {
        opacity = !this.disableToolbar ? "0.75" : "0.25";
        return `3px solid ${color.replace(")", `, ${opacity})`)}`;
      } else {
        opacity = !this.disableToolbar ? "C0" : "30";
        return `3px solid ${color.concat(opacity)}`;
      }
    }

    return `3px solid rgba(0, 0, 0, ${opacity})`;
  }

  // Emoji
  setEmoji(e) {
    const activator = e.target;

    const EmojiPickerComponent = Vue.extend(EmojiPicker);
    const instance: any = new EmojiPickerComponent({
      vuetify: vuetify,
      propsData: {
        dark: this.dark,
      },
    });

    instance.$mount();
    instance.$on("emojiSelected", emoji => {
      this.editor.commands.insertContent(emoji);
    });

    document.querySelector("body").appendChild(instance.$el);

    // Set Position
    const position = activator.getBoundingClientRect();
    instance.$children[0].absoluteX = position.x + 14;
    instance.$children[0].absoluteY = position.y + 14;

    // Display emoji picker
    instance.value = true;
  }

  // Headings
  headingsItems = [
    { text: "Heading 1", value: 1 },
    { text: "Heading 2", value: 2 },
    { text: "Heading 3", value: 3 },
    { text: "Text", value: 0 },
  ];

  selectedHeading = 0;

  @Watch("selectedHeading")
  onHeadingChanged(newValue, oldValue) {
    if (newValue === oldValue || newValue === this.getHeading()) {
      return;
    }

    if (newValue > 0) {
      this.editor.chain().focus().toggleHeading({ level: newValue }).run();
    } else {
      this.editor.chain().focus().setParagraph().run();
    }
  }

  getHeading() {
    if (this.editor.isActive("heading", { level: 1 })) {
      return 1;
    }

    if (this.editor.isActive("heading", { level: 2 })) {
      return 2;
    }

    if (this.editor.isActive("heading", { level: 3 })) {
      return 3;
    }

    return 0;
  }

  // Image
  @Prop() readonly uploadImage: (file: File) => Promise<string>;

  get defaultUploadImage() {
    return this.uploadImage || getOption("uploadImage");
  }

  imageDialog = false;

  get selectedImage() {
    return this.editor.view.state.selection["node"]?.attrs?.src;
  }

  // Link
  linkDialog = false;

  get selectedLink() {
    return this.editor.getAttributes("link").href;
  }

  // Video
  videoDialog = false;

  get selectedVideo() {
    return this.editor.getAttributes("iframe").src;
  }

  // Mention
  @Prop() readonly mentionItems: Record<string, any>[];

  mention = {
    items: [],
    selected: 0,
    show: false,
    x: 0,
    y: 0,
    command: _ => 0,
  };

  selectMention(index) {
    const item = this.mention.items[index];
    this.mention.command({ id: item.value, label: item.text });
    this.mention.show = false;

    this.$emit("mention", item);
  }
}
</script>

<style lang="scss">
.v-tiptap {
  overflow-wrap: anywhere;

  .v-btn > .v-btn__content .v-icon.fa {
    font-size: 18px !important;
  }

  .ProseMirror {
    padding: 8px 18px;
    min-height: 180px;
    overflow-wrap: anywhere;
  }

  &.dense {
    .ProseMirror {
      padding: 6px 12px;
      min-height: 32px;
    }
    p {
      padding: 0 0;
      line-height: 1.2rem;
    }
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }

  .v-select__selection--disabled {
    color: rgba(0, 0, 0, 0.26) !important;
  }

  .theme--dark {
    .v-select__selection {
      color: #fcfcfc !important;
    }

    .v-input__slot:hover {
      background: #1e1e1e !important;
    }

    .v-select__selection--disabled {
      color: #fcfcfc71 !important;
    }
  }

  .v-toolbar__content {
    flex-wrap: wrap;
    padding: 4px 12px;

    .v-select {
      width: min-content;
      margin-bottom: 0px !important;

      .v-input__slot:hover {
        background: #fcfcfc;
        border-radius: 4px;
      }
      .v-input__slot::before,
      .v-input__slot::after {
        display: none;
      }
      .v-input__control > div {
        height: 28px;
        min-height: 24px !important;
        padding: 6px !important;
      }
      .v-input__icon {
        min-width: auto;
        width: auto;
        margin-left: -4px;
        margin-right: -4px;
      }
      .v-input__append-inner {
        padding: 0px;
      }
      .v-select__selection {
        margin-top: 0px;
        font-size: 14px;
        margin-right: 8px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.7);
      }
    }
    .v-btn.v-btn--icon {
      border-radius: 4px;
    }
  }

  .divider {
    width: 2px;
    height: 1.25rem;
    background-color: rgba(#000, 0.1);
    margin-left: 0.25rem;
    margin-right: 0.5rem;
  }

  :focus-visible {
    outline: -webkit-focus-ring-color auto 0px;
  }

  p {
    padding: 0.35em 0;
    margin: 2px 0px;
    margin-bottom: 0;
    line-height: 1.5rem;
  }

  h1 {
    font-size: 2.125rem !important;
    line-height: 2.5rem;
    letter-spacing: 0.0073529412em !important;
    font-weight: 400;
    font-family: Roboto, sans-serif !important;
    margin: 0.75em 0 0.5em 0;
    &:first-child {
      margin-top: 0.25em;
    }
  }

  h2 {
    line-height: 2rem;
    font-family: Roboto, sans-serif !important;
    font-size: 1.5rem !important;
    font-weight: 400;
    letter-spacing: normal !important;
    margin: 0.75em 0 0.5em 0;
  }

  h3 {
    font-size: 1.25rem !important;
    font-weight: 500;
    letter-spacing: 0.0125em !important;
    line-height: 2rem;
    font-family: Roboto, sans-serif !important;
    margin: 0.75em 0 0.5em 0;
  }

  blockquote {
    margin-left: 1rem;
    padding-left: 0.75em;
    font-weight: 300;
    border-left: 3px solid rgba(#0d0d0d, 0.2);
  }

  img {
    max-width: min(640px, 100%);
    height: auto;

    &.focus {
      outline: 4px solid rgb(80, 173, 248);
    }
  }
  .iframe-wrapper {
    iframe {
      width: 640px;
      height: 360px;
    }

    &.focus {
      iframe {
        outline: 4px solid rgb(80, 173, 248);
      }
    }
  }

  ul,
  ol {
    padding-left: 20px;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    p {
      margin: 0;
    }

    li {
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        margin-top: 0.4rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }

  .mention {
    color: #08c;
  }

  .v-label {
    color: rgba(0, 0, 0, 0.7) !important;
    font-weight: 500;
    line-height: 2rem;
  }
}
</style>
