<template>
  <div class="v-tiptap" :class="{ inline, view }">
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
        :class="{ 'py-2 px-3': inline }"
        :outlined="!inline"
        style="width: 100%"
        v-bind="$attrs"
        :style="{
          borderColor: $attrs['error-messages'] ? '#ff5252' : undefined,
        }"
      >
        <!-- Toolbar -->
        <v-toolbar
          v-if="!hideToolbar && toolbar.length"
          dense
          flat
          color="grey lighten-4"
          height="auto"
          class="py-1"
        >
          <template v-for="(item, key) in items">
            <!-- Spacer -->
            <v-spacer v-if="item.type === 'spacer'" :key="key" />
            <!-- Divider -->
            <div
              v-else-if="item.type === 'divider'"
              class="divider"
              :key="key"
            />
            <!-- Slot -->
            <div v-else-if="item.type === 'slot'" :key="key">
              <slot :name="item.slot" v-bind="{ editor }" />
            </div>
            <!-- Buttons -->
            <div v-else class="my-1" :key="key">
              <v-tooltip :open-delay="500" top>
                <span>{{ item.title }}</span>
                <template v-slot:activator="{ on, attrs }">
                  <!-- Headings -->
                  <div v-if="item.type === 'headings'" class="ml-n1">
                    <v-select
                      v-model="selectedHeading"
                      :items="headingsItems"
                      dense
                      hide-details="auto"
                      style="width: 104px"
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
          </template>
        </v-toolbar>

        <div class="d-flex">
          <!-- Slot Prepend -->
          <slot name="prepend" />
          <!-- Tiptap Editor -->
          <slot name="editor">
            <editor-content :editor="editor" class="flex-grow-1" />
          </slot>
          <!-- Slot Append -->
          <slot name="append" />
        </div>
      </v-card>
    </v-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import collect from "collect.js";
import "@/styles/styles.scss";

import { Editor, EditorContent } from "@tiptap/vue-2";
import TiptapKit from "@/plugins/tiptap-kit";

//import VTiptapLinkDialog from "./VTiptapLinkDialog.vue";
//import VTiptapVideoDialog from "./VTiptapVideoDialog.vue";

//import ImageDialog from '@/plugins/ui/tiptap/ImageDialog.vue';
//import EmojiPicker from '@/plugins/ui/tiptap/EmojiPicker.vue';
//import i18n from '@/plugins/i18n';

import toolbarItems from "@/constants/toolbarItems";
import toolbarDefinitions from "@/constants/toolbarDefinitions";

import xssRules from "@/constants/xssRules";
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

  @Prop({ default: false }) readonly view: boolean;

  @Prop() readonly placeholder: string | null;

  @Prop({ default: () => toolbarItems }) readonly toolbar: string[];

  @Prop({ default: () => xssRules })
  readonly xssOptions: Record<string, string[]>;

  @Prop({ default: false }) readonly hideToolbar: boolean;

  @Prop({ default: true }) readonly xss: boolean | string[];

  @Prop({ default: false }) readonly inline: boolean;

  @Prop({ default: false }) readonly disabled: boolean;

  editor: Editor | null = null;

  get cleanValue() {
    if (this.xss === false) {
      return this.value;
    }

    const value = this.value
      .replace("https://youtu.be/", "https://www.youtube.com/watch?v=")
      .replace("watch?v=", "embed/")
      .replace("https://vimeo.com/", "https://player.vimeo.com/video/");

    // eslint-disable-next-line
    let whiteList: any = collect(this.xssOptions);

    if (Array.isArray(this.xss)) {
      whiteList = whiteList.only(this.xss);
    }

    return xss(value, {
      whiteList: whiteList.all(),
    });
  }

  get items() {
    return toolbarDefinitions(this);
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

  selectedColor = null;

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
    // const extensionsDefinition = {
    //   focus: Focus.configure({
    //     className: "focus",
    //   }),
    // };

    // let extensions = [];
    // for (let i of this.extensions) {
    //   if (extensionsDefinition[i]) {
    //     extensions.push(extensionsDefinition[i]);
    //   }
    // }

    // enabledExtesions = ['bold'];

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
          bold: false,
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
          // video: {},
        }),
      ],
      autofocus: false,
      editable: true,
      injectCSS: true,
    });
  }

  @Watch("value")
  onValueChanged(value) {
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
