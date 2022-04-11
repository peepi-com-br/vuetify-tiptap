// import the helper!
import { storyFactory } from "~storybook/util/helpers";
// import the component to be tested
import VTiptap from "../components/VTiptap.vue";

import testHtml from "../constants/testHtml";
import CharacterCount from "@tiptap/extension-character-count";

// set the default properties
export default storyFactory({
  title: "VTiptap",
  component: VTiptap,
  description: "This can be **markdown**!",
  argTypes: {
    toolbar: { control: "array" },
    value: { control: "color" },
  },
  args: {
    toolbar: undefined,
    value: "",
  },
});

function makeSlots(args) {
  return Object.entries(args.slots || {}).map(
    ([key, value]) =>
      `<template #${key}="{ editor, disabled }">${value}</template>\n`
  );
}

// create a base template to share
const Template = (args, { argTypes }) => ({
  components: { VTiptap },
  props: Object.keys(argTypes),

  template: `
  <v-tiptap v-bind="$props" style="max-width:800px">
    ${makeSlots(args)}
  </v-tiptap>`,
});

// now the stories, you need at least one
export const BasicUsage = Template.bind({});
BasicUsage.args = {
  placeholder: "Type anything here",
};

export const BasicUsageWithText = Template.bind({});
BasicUsageWithText.args = { value: testHtml };

export const BasicUsageWithView = Template.bind({});
BasicUsageWithView.args = { value: testHtml, view: true };

// Toolbard
export const CustomToolbar = Template.bind({});
CustomToolbar.args = {
  toolbar: [
    "h1",
    "h2",
    "h3",
    "|",
    "bold",
    "color",
    "|",
    "left",
    "right",
    ">",
    "clear",
  ],
};

export const CustomButtons = Template.bind({});
CustomButtons.args = {
  toolbar: ["#emoji", "#clear"],
  slots: {
    emoji: `<v-btn icon small @click="editor.commands.insertContent('😀')"><v-icon>mdi-emoticon-outline</v-icon></v-btn>`,
    clear: `<v-btn text small @click="editor.commands.clearContent()">Clear</v-btn>`,
  },
};

export const DisabledToolbar = Template.bind({});
DisabledToolbar.args = {
  toolbar: ["bold", "color", "headings", "#emoji"],
  disableToolbar: true,
  slots: {
    emoji: `<v-btn icon small @click="editor.commands.insertContent('😀')" :disabled="disabled"><v-icon>mdi-emoticon-outline</v-icon></v-btn>`,
  },
};

// Slots
export const SlotsBottom = Template.bind({});
SlotsBottom.storyName = "Slots: Bottom";
SlotsBottom.args = {
  extensions: [CharacterCount],
  slots: {
    bottom: `
    <v-toolbar dense elevation="0" class="px-4"  style="border-top: 1px solid #DDD">
      <v-btn icon small @click="onClick"><v-icon>mdi-home</v-icon></v-btn>
      <v-spacer/>
      <small class="text-uppercase" style="opacity: 0.5;">{{ editor.storage.characterCount.characters() }}</small>
      <v-spacer/>
      <v-btn icon small @click="onClick"><v-icon>mdi-send</v-icon></v-btn>
    </v-toolbar>`,
  },
};

export const SlotsPrepend = Template.bind({});
SlotsPrepend.storyName = "Slots: Prepend and Append";
SlotsPrepend.args = {
  hideToolbar: true,
  editorClass: "py-1",
  dense: true,
  placeholder: "Insert your comment here... (Use CTRL + B to make it bold)",

  slots: {
    prepend: `<v-avatar color="indigo" size="26" class="ma-2" title="Prepend Slot"><v-icon dark>mdi-account-circle</v-icon></v-avatar>`,
    append: `<v-btn icon small class="ma-2" title="Append Slot"><v-icon>mdi-send</v-icon></v-avatar>`,
  },
};
