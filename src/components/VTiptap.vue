<template>
  <div class="v-tiptap" :class="{ dense, view }">
    <!-- View mode -->
    <div v-if="view" v-html="cleanValue" style="width: 100%" />
    <!-- Edit Mode -->
    <v-input
      v-else
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
          :color="dark ? undefined: 'grey lighten-4'"
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
              <slot :name="item.slot" v-bind="{ editor }" />
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
                      :nudge-left="14"
                    >
                      <template #button="{ on }">
                        <v-btn
                          v-on="on"
                          :disabled="disableToolbar"
                          icon
                          small
                          style=""
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
            />
          </slot>
          <!-- Slot Append -->
          <slot name="append" v-bind="{ editor }" />
        </div>

        <slot name="bottom" v-bind="{ editor }" />
      </v-card>

      <!-- Dialogs -->
      <ImageDialog
        :value="imageSrc"
        :show="imageDialog"
        :dark="dark"
        @close="imageDialog = $event"
        @input="onSelectImage"
      >
        <template #image>
          <slot name="image" v-bind="{ editor, imageSrc }" />
        </template>
      </ImageDialog>
    </v-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import collect from "collect.js";

import { Editor, EditorContent } from "@tiptap/vue-2";
import TiptapKit from "../plugins/tiptap-kit";
import vuetify from "../plugins/vuetify";

import LinkDialog from "./LinkDialog.vue";
import VideoDialog from "./VideoDialog.vue";
import ImageDialog from "./ImageDialog.vue";

import EmojiPicker from "./EmojiPicker.vue";
import ColorPicker from "./ColorPicker.vue";

import toolbarItems from "../constants/toolbarItems";
import makeToolbarDefinitions from "../constants/toolbarDefinitions";

import xssRules from "../constants/xssRules";
import xss from "xss";

import {
  VInput,
  VCard,
  VBtn,
  VIcon,
  VToolbar,
  VSelect,
  VSpacer,
  VTooltip,
} from "vuetify/lib";

@Component({
  components: {
    EditorContent,
    ColorPicker,
    ImageDialog,
    VInput,
    VCard,
    VBtn,
    VIcon,
    VToolbar,
    VSelect,
    VSpacer,
    VTooltip,
  },
})
export default class extends Vue {
  @Prop({ default: "" }) readonly value: string | null;

  @Prop({ default: false }) readonly view: boolean;

  @Prop({ default: false }) readonly dark: boolean;

  @Prop() readonly placeholder: string | null;

  @Prop({ default: () => toolbarItems }) readonly toolbar: string[];

  @Prop({ default: () => xssRules })
  readonly xssOptions: Record<string, string[]>;

  @Prop({ default: false }) readonly hideToolbar: boolean;

  @Prop({ default: false }) readonly disableToolbar: boolean;

  @Prop({ default: true }) readonly xss: boolean | string[];

  @Prop({ default: false }) readonly dense: boolean;

  @Prop({ default: true }) readonly outlined: boolean;

  @Prop({ default: false }) readonly disabled: boolean;

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

    let whiteList: any = collect(this.xssOptions);
    whiteList = Array.isArray(this.xss) ? whiteList.only(this.xss) : whiteList;

    return xss(value, {
      whiteList: whiteList.all(),
    });
  }

  get imageSrc() {
    // // Babel is not working at the moment - Ugly workaround
    // if (
    //   !this.editor ||
    //   !this.editor.view.state.selection["node"] ||
    //   !this.editor.view.state.selection["node"].attrs
    // ) {
    //   return null;
    // }

    return this.editor?.view.state.selection["node"]?.attrs?.src;
  }

  onSelectImage(value: string) {
    // @ts-ignore
    this.editor.chain().focus().setImage({ src: value }).run();
  }

  get items() {
    return makeToolbarDefinitions(this);
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
      // @ts-ignore
      this.editor.chain().focus().toggleHeading({ level: newValue }).run();
    } else {
      // @ts-ignore
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

  // Alignment
  alinmentItems = [
    { text: "< 1", value: "left" },
    { text: ">< 2", value: "center" },
    { text: "> 3", value: "right" },
    { text: "-", value: "justify" },
  ];

  selectedAlignment = "left";

  @Watch("selectedAlignment")
  onAlignmentChanged(newValue, oldValue) {
    if (newValue === oldValue || newValue === this.getAlignment()) {
      return;
    }

    // @ts-ignore
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

  selectedColor = null;

  get selectedColorBorder() {
    if (this.selectedColor) {
      let color = `${this.selectedColor}`;
      color =
        color[0] === "r" ? color.replace(")", ", 0.75)") : color.concat("C0");

      return `3px solid ${color}`;
    }

    return "3px solid rgba(0, 0, 0, 0.67)";
  }

  setLink() {
    const previousUrl = this.editor.getAttributes("link").href;

    const instance = new LinkDialog({
      vuetify: vuetify,
      propsData: { value: previousUrl, dark: this.dark },
    });

    instance.$on("input", (url) => {
      if (url === "" || url === null) {
        // @ts-ignore
        this.editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        this.editor
          .chain()
          .focus()
          .extendMarkRange("link")
          // @ts-ignore
          .setLink({ href: url })
          .run();
      }
    });

    instance.$mount();
  }

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
    instance.$on("emojiSelected", (emoji) => {
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

  imageDialog = false;

  async selectImage() {
    this.imageDialog = true;
  }

  setVideo() {
    const previousSrc = this.editor.getAttributes("iframe").src;

    const instance = new VideoDialog({
      vuetify: vuetify,
      propsData: { value: previousSrc, dark: this.dark },
    });

    instance.$on("input", (src) => {
      this.editor.chain().focus().setIframe({ src }).run();
    });

    instance.$mount();
  }

  created() {
    this.editor = new Editor({
      content: this.value,
      editorProps: {
        handleKeyDown: (view, event) => {
          if (
            event.key === "Enter" &&
            this.$listeners.enter &&
            !event.shiftKey
          ) {
            this.$emit("enter");
            return true;
          }

          return false;
        },
      },
      onSelectionUpdate: ({ editor }) => {
        const { color } = editor.getAttributes("textStyle");
        this.selectedColor = color;

        this.selectedHeading = this.getHeading();
      },
      onUpdate: ({ editor }) => this.$emit("input", editor.getHTML()),
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
        }),
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
}
</script>

<style lang="scss">
.v-tiptap {
  overflow-wrap: anywhere;

  .ProseMirror {
    padding: 12px 18px;
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
      color:#fcfcfc !important;        
    }
    .v-input__slot:hover {
      background: #1e1e1e!important;
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
    padding: 0.75em 0 0.5em 0;
  }

  h2 {
    line-height: 2rem;
    font-family: Roboto, sans-serif !important;
    font-size: 1.5rem !important;
    font-weight: 400;
    letter-spacing: normal !important;
    padding: 0.75em 0 0.5em 0;
  }

  h3 {
    font-size: 1.25rem !important;
    font-weight: 500;
    letter-spacing: 0.0125em !important;
    line-height: 2rem;
    font-family: Roboto, sans-serif !important;
    padding: 0.75em 0 0.5em 0;
  }

  blockquote {
    margin-left: 1rem;
    padding-left: 0.75em;
    font-weight: 300;
    border-left: 3px solid rgba(#0d0d0d, 0.2);
  }

  img {
    max-width: 638px;
    height: auto;
    border: 4px solid rgba(0, 0, 0, 0);
    margin-left: -4px;

    &.focus {
      border: 4px solid rgb(80, 173, 248);
    }
  }
  .iframe-wrapper {
    iframe {
      width: 640px;
      height: 360px;
      border: 4px solid rgba(0, 0, 0, 0);
      margin-left: -4px;
    }

    &.focus {
      iframe {
        border: 4px solid rgb(80, 173, 248);
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
        margin-top: 1.1rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
