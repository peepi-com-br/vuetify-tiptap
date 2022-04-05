<template>
  <!-- <div class="main">
    <v-input
      class="v-tiptap"
      :messages="['Messages']"
      append-icon="mdi-close"
      prepend-icon="mdi-phone"
    >
      <editor-content :editor="editor" />
    </v-input>
  </div> -->
  <div class="v-tiptap" :class="{ inline, view }">
    <v-input
      v-if="view === false"
      class="simple outside-label"
      style="padding-top: 0px !important"
      v-bind="$attrs"
      hide-details="auto"
    >
      <v-card
        flat
        :class="{ 'py-2 px-3': inline }"
        :outlined="!inline"
        style="width: 100%"
      >
        <!-- Toolbar -->
        <v-toolbar
          v-if="!hideToolbar && !codeEditor"
          dense
          flat
          color="grey lighten-4"
          height="auto"
          class="py-1"
        >
          <div v-for="(item, key) in items" :key="key" class="my-1">
            <!-- Divider -->
            <div class="divider" v-if="item.type === 'divider'" />
            <!-- Other -->
            <div v-else>
              <v-tooltip :open-delay="500" top>
                <span>{{ item.title }}</span>
                <template v-slot:activator="{ on, attrs }">
                  <!-- Headings -->
                  <div v-if="item.type === 'headings'" class="ml-n1">
                    <v-select
                      v-model="selectedHeading"
                      :items="headingsItems"
                      :disabled="code"
                      dense
                      hide-details="auto"
                      style="width: 84px"
                    />
                  </div>
                  <!-- Alignment -->
                  <!-- <div v-else-if="item.type === 'alignment'" class="mr-1">
                    <v-select v-model="selectedHeading" :items="headingsItems" dense hide-details="auto" />
                  </div> -->
                  <!-- Color Button -->
                  <div v-else-if="item.title === 'Color'" class="mr-1">
                    <!--  <ColorPicker
                      v-model="selectedColor"
                      @input="item.action(selectedColor)"
                      v-bind="attrs"
                      v-on="on"
                      :more="false"
                      :nudge-top="-4"
                      :nudge-left="14"
                      gray-scale
                    >
                      <template #button="{ on }">
                        <v-btn v-on="on" :disabled="code" icon small style="">
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
                    </ColorPicker> -->
                  </div>

                  <!-- Standard Button -->
                  <v-btn
                    v-else
                    :disabled="code"
                    :class="{
                      'v-btn--active': item.isActive && item.isActive(),
                    }"
                    :color="
                      item.isActive && item.isActive() ? 'primary' : undefined
                    "
                    v-bind="attrs"
                    v-on="on"
                    @click="item.action()"
                    class="mr-1"
                    icon
                    small
                  >
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>

          <v-spacer />

          <!-- Right Buttons ? -->
          <v-btn
            v-if="codeEditable"
            text
            @click="code = !code"
            :color="code ? 'primary' : undefined"
            small
          >
            HTML
          </v-btn>
        </v-toolbar>

        <div class="d-flex">
          <slot name="prepend" />

          <!-- Tiptap Editor -->
          <editor-content
            v-if="!html && !code"
            :editor="editor"
            class="flex-grow-1"
          />

          <!-- Prism HTML Editor -->
          <prism-editor
            v-else
            @input="$emit('input', $event)"
            @blur="onCodeBlur"
            style="background: #f5f2f0; max-height: 80vh"
            class="py-4"
            :value="value"
            :highlight="highlighter"
            line-numbers
          />

          <slot name="append" />
        </div>
      </v-card>
    </v-input>
    <!-- View mode -->
    <div v-else v-html="cleanValue" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
//import VTiptapLinkDialog from "./VTiptapLinkDialog.vue";
//import VTiptapVideoDialog from "./VTiptapVideoDialog.vue";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Blockquote from "@tiptap/extension-blockquote";
import Focus from "@tiptap/extension-focus";
import History from "@tiptap/extension-history";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

//import ImageDialog from '@/plugins/ui/tiptap/ImageDialog.vue';
//import EmojiPicker from '@/plugins/ui/tiptap/EmojiPicker.vue';
//import Video from '@/plugins/ui/tiptap/video-new';
//import i18n from '@/plugins/i18n';

import xss from "xss";

import { highlight, languages } from "prismjs";
import { PrismEditor } from "vue-prism-editor";
import pretty from "pretty";

import "vue-prism-editor/dist/prismeditor.min.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import collect from "collect.js";

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
    PrismEditor,
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
export default class VTiptap extends Vue {
  @Prop() readonly value: string | null;

  @Prop() readonly placeholder: string | null;

  @Prop({ default: false }) readonly view: boolean | string[] | string;

  @Prop({ default: false }) readonly codeEditable: boolean;

  @Prop({ default: false }) readonly codeEditor: boolean;

  @Prop({ default: true }) readonly xss: boolean;

  @Prop({ default: "html" }) readonly codeLanguage: string;

  @Prop({ default: false }) readonly hideToolbar: boolean;

  @Prop({ default: false }) readonly inline: boolean;

  @Prop({ default: false }) readonly disabled: boolean;

  html = false;

  editor: Editor | null = null;

  code = false;

  highlighter(code) {
    return highlight(code, languages[this.codeLanguage]);
  }

  get cleanValue() {
    if (!this.xss) {
      return this.value;
    }

    const value = this.value
      .replace("https://youtu.be/", "https://www.youtube.com/watch?v=")
      .replace("watch?v=", "embed/")
      .replace("https://vimeo.com/", "https://player.vimeo.com/video/");

    let whiteList = collect({
      a: ["href", "title", "target"],
      span: ["style"],
      blockquote: ["style"],
      p: ["style"],
      hr: [],
      pre: [],
      code: [],
      strong: [],
      img: ["src", "alt", "title"],
      label: ["contenteditable"],
      input: ["type", "value"],
      div: ["class"],
      iframe: ["src", "allowfullscreen"],
      em: [],
      s: [],
      mark: [],
      h1: [],
      h2: [],
      h3: [],
      ul: ["class", "data-type"],
      li: ["data-checked"],
      ol: [],
      u: [],
      tr: ["class", "style"],
      td: ["class", "style"],
      th: ["class", "style"],
      tbody: ["class", "style"],
      table: ["class", "style"],
      br: [],
    });

    if (Array.isArray(this.view)) {
      whiteList = whiteList.only(this.view);
    }

    return xss(value, {
      /* eslint-disable-next-line */
      whiteList: whiteList.all(),
    });
  }

  get items() {
    return [
      {
        title: "Bold",
        icon: "mdi-format-bold",
        action: () => this.editor.chain().focus().toggleBold().run(),
        isActive: () => this.editor.isActive("bold"),
      },
      {
        title: "Italic",
        icon: "mdi-format-italic",
        action: () => this.editor.chain().focus().toggleItalic().run(),
        isActive: () => this.editor.isActive("italic"),
      },
      {
        title: "Underline",
        icon: "mdi-format-underline",
        action: () => this.editor.chain().focus().toggleUnderline().run(),
        isActive: () => this.editor.isActive("underline"),
      },
      {
        title: "Strike",
        icon: "mdi-format-strikethrough",
        action: () => this.editor.chain().focus().toggleStrike().run(),
        isActive: () => this.editor.isActive("strike"),
      },
      {
        title: "Color",
        icon: "mdi-palette",
        action: (color) => this.editor.chain().focus().setColor(color).run(),
        isActive: () => this.editor.isActive("textStyle"),
      },
      { type: "divider" },
      // {
      //   title: 'Highlight',
      //   icon: 'mdi-grease-pencil',
      //   action: () => this.editor.chain().focus().toggleHighlight().run(),
      //   isActive: () => this.editor.isActive('highlight'),
      // },
      // { type: 'divider' },
      { type: "headings" },
      // {
      //   title: 'Heading 1',
      //   icon: 'mdi-format-header-1',
      //   action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      //   isActive: () => this.editor.isActive('heading', { level: 1 }),
      // },
      // {
      //   title: 'Heading 2',
      //   icon: 'mdi-format-header-2',
      //   action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      //   isActive: () => this.editor.isActive('heading', { level: 2 }),
      // },
      // {
      //   title: 'Heading 3',
      //   icon: 'mdi-format-header-3',
      //   action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      //   isActive: () => this.editor.isActive('heading', { level: 3 }),
      // },
      // {
      //   title: 'Paragraph',
      //   icon: 'mdi-format-paragraph',
      //   action: () => this.editor.chain().focus().setParagraph().run(),
      //   isActive: () => this.editor.isActive('paragraph'),
      // },
      { type: "divider" },
      {
        title: "left",
        icon: "mdi-format-align-left",
        action: () => this.editor.chain().focus().setTextAlign("left").run(),
        isActive: () => this.editor.isActive({ textAlign: "left" }),
      },
      {
        title: "center",
        icon: "mdi-format-align-center",
        action: () => this.editor.chain().focus().setTextAlign("center").run(),
        isActive: () => this.editor.isActive({ textAlign: "center" }),
      },
      {
        title: "right",
        icon: "mdi-format-align-right",
        action: () => this.editor.chain().focus().setTextAlign("right").run(),
        isActive: () => this.editor.isActive({ textAlign: "right" }),
      },
      {
        title: "justify",
        icon: "mdi-format-align-justify",
        action: () => this.editor.chain().focus().setTextAlign("justify").run(),
        isActive: () => this.editor.isActive({ textAlign: "justify" }),
      },
      { type: "divider" },
      {
        title: "Bullet List",
        icon: "mdi-format-list-bulleted-square",
        action: () => this.editor.chain().focus().toggleBulletList().run(),
        isActive: () => this.editor.isActive("bulletList"),
      },
      {
        icon: "mdi-format-list-numbered",
        title: "Ordered List",
        action: () => this.editor.chain().focus().toggleOrderedList().run(),
        isActive: () => this.editor.isActive("orderedList"),
      },
      // {
      //   icon: 'mdi-format-list-checkbox',
      //   title: 'Task List',
      //   action: () => this.editor.chain().focus().toggleTaskList().run(),
      //   isActive: () => this.editor.isActive('taskList'),
      // },
      { type: "divider" },
      {
        title: "Link",
        icon: "mdi-link-variant",
        action: this.setLink,
        isActive: () => this.editor.isActive("link"),
      },
      {
        icon: "mdi-image",
        title: "Image",
        action: this.selectImage,
        isActive: () => this.editor.isActive("image"),
      },
      {
        icon: "mdi-video",
        title: "Video",
        action: this.setVideo,
        isActive: () => this.editor.isActive("iframe"),
      },
      {
        icon: "mdi-emoticon-outline",
        title: "Emoji",
        action: this.setEmoji,
      },
      // {
      //   icon: 'mdi-format-quote-open',
      //   title: 'Blockquote',
      //   action: () => this.editor.chain().focus().toggleBlockquote().run(),
      //   isActive: () => this.editor.isActive('blockquote'),
      // },
      // {
      //   icon: 'mdi-minus',
      //   title: 'Horizontal Rule',
      //   action: () => this.editor.chain().focus().setHorizontalRule().run(),
      // },
      // { type: 'divider' },
      // {
      //   title: 'Code',
      //   icon: 'mdi-code-tags',
      //   action: () => this.editor.chain().focus().toggleCode().run(),
      //   isActive: () => this.editor.isActive('code'),
      // },
      // {
      //   icon: 'mdi-code-braces-box',
      //   title: 'Code Block',
      //   action: () => this.editor.chain().focus().toggleCodeBlock().run(),
      //   isActive: () => this.editor.isActive('codeBlock'),
      // },
      { type: "divider" },
      {
        icon: "mdi-format-clear",
        title: "Clear Format",
        /* eslint newline-per-chained-call: "off" */
        action: () =>
          this.editor.chain().focus().clearNodes().unsetAllMarks().run(),
      },
    ];
  }

  // Headings
  headingsItems = [
    { text: "Título 1", value: 1 },
    { text: "Título 2", value: 2 },
    { text: "Título 3", value: 3 },
    { text: "Texto", value: 0 },
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

  @Watch("code")
  onCodeChange() {
    if (this.codeLanguage === "html") {
      this.$emit("input", pretty(this.cleanValue));
    }
  }

  onCodeBlur() {
    if (this.codeLanguage === "html") {
      this.$emit("input", pretty(this.cleanValue));
    }
  }

  selectedColor = null;

  get selectedColorBorder() {
    if (this.selectedColor) {
      const color = `${this.selectedColor}`;
      return `3px solid ${color}C0`;
    }

    return this.code
      ? "3px solid rgba(0,0,0,0.2)"
      : "3px solid rgba(0, 0, 0, 0.67)";
  }

  setLink() {
    /* const previousUrl = this.editor.getAttributes("link").href;

    const instance = new VTiptapLinkDialog({
      i18n,
      vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
      propsData: { value: previousUrl },
    });

    instance.$on("input", (url) => {
      if (url === "" || url === null) {
        this.editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        this.editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }
    });

    instance.$mount(); */
  }

  setEmoji(e) {
    /* const activator = e.target;

    const EmojiPickerComponent = Vue.extend(EmojiPicker);
    const instance = new EmojiPickerComponent({
      i18n,
      vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
    });

    instance.$mount();
    // TODO: use input event
    instance.$on("emojiSelected", (emoji) => {
      this.editor.commands.insertContent(emoji);
    });

    document.querySelector("body").appendChild(instance.$el);

    // Set Position
    const position = activator.getBoundingClientRect();
    instance.$children[0].absoluteX = position.x + 14;
    instance.$children[0].absoluteY = position.y + 14;

    // Display emoji picker
    instance.value = true; */
  }

  async selectImage() {
    /*  const value = this.editor.view.state.selection.node?.attrs?.src;

    const ImageDialogComponent = Vue.extend(ImageDialog);
    const instance = new ImageDialogComponent({
      i18n,
      vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
      propsData: { value },
    });

    instance.$mount();
    instance.$on("input", (src) => {
      this.editor.chain().focus().setImage({ src }).run();
    });

    document.querySelector("body").appendChild(instance.$el); */
  }

  setVideo() {
    /*  const previousSrc = this.editor.getAttributes("iframe").src;

    const instance = new VTiptapVideoDialog({
      i18n,
      vuetify: Vue.prototype.tiptapVuetifyPlugin.vuetify,
      propsData: { value: previousSrc },
    });

    instance.$on("input", (src) => {
      this.editor.chain().focus().setIframe({ src }).run();
    });

    instance.$mount(); */
  }

  created() {
    if (this.codeEditor) {
      this.code = true;
    }

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
        Blockquote.configure({
          HTMLAttributes: {
            class: "blockquote",
          },
        }),
        Color,
        Document,
        Focus.configure({
          className: "focus",
        }),
        Highlight.configure({
          multicolor: true,
        }),
        History.configure({
          depth: 10,
        }),
        Image,
        Link.configure({
          openOnClick: false,
        }),
        Paragraph,
        Placeholder.configure({
          placeholder: () => {
            if (!this.placeholder) {
              return "";
            }

            return this.placeholder;
          },
        }),
        StarterKit.configure({
          history: false,
          heading: {
            levels: [1, 2, 3],
          },
        }),
        TaskList.configure({
          HTMLAttributes: {
            class: "task-list",
          },
        }),
        TaskItem.configure({
          itemTypeName: "taskItem",
        }),
        Text,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        TextStyle,
        Underline,
        // Video,
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

  &.inline {
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
