import { storyFactory } from "~storybook/util/helpers";
import { userEvent, screen } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import delay from "delay";

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
  props: Object.keys(argTypes).filter(key => key !== "slots"),

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
BasicUsageWithText.storyName = "Basic Usage (Value)";
BasicUsageWithText.args = {
  value: testHtml,
  label: "Basic Usage (Value)",
};

export const BasicUsageWithView = Template.bind({});
BasicUsageWithView.storyName = "Basic Usage (View Mode)";
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

export const Mentions = Template.bind({});
Mentions.args = {
  value: `<p>Type @ to start mentioning people: <span data-type="mention" class="mention" data-id="1" data-label="Cyndi Lauper" contenteditable="false">@Cyndi Lauper</span> </p>`,
  mentionItems: [
    { text: "Cyndi Lauper", value: 1 },
    { text: "Tom Cruise", value: 1 },
    { text: "Madonna", value: 1 },
    { text: "Jerry Hall", value: 1 },
    { text: "Joan Collins", value: 1 },
    { text: "Winona Ryder", value: 1 },
    { text: "Christina Applegate", value: 1 },
    { text: "Alyssa Milano", value: 1 },
    { text: "Molly Ringwald", value: 1 },
    { text: "Ally Sheedy", value: 1 },
    { text: "Debbie Harry", value: 1 },
    { text: "Olivia Newton-John", value: 1 },
    { text: "Elton John", value: 1 },
    { text: "Michael J. Fox", value: 1 },
    { text: "Axl Rose", value: 1 },
    { text: "Emilio Estevez", value: 1 },
    { text: "Ralph Macchio", value: 1 },
    { text: "Rob Lowe", value: 1 },
    { text: "Jennifer Grey", value: 1 },
    { text: "Mickey Rourke", value: 1 },
    { text: "John Cusack", value: 1 },
    { text: "Matthew Broderick", value: 1 },
    { text: "Justine Bateman", value: 1 },
    { text: "Lisa Bonet", value: 1 },
  ],
};

export const UploadImage = Template.bind({});
UploadImage.args = {
  uploadImage: async file => {
    await delay(2000);
    return "https://fakeimg.pl/360x240/25a7fd";
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
      <small class="text-uppercase" style="opacity: 0.5;">{{ editor.storage.characterCount.characters() }} characters</small>
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

export const TestBasic = Template.bind({});
TestBasic.args = {};
TestBasic.play = async () => {
  await userEvent.click(screen.getByTestId("value").children[0].children[0]);

  await userEvent.keyboard("Testing", { delay: 100 });
  await userEvent.keyboard("a", {
    keyboardState: userEvent.keyboard("[ControlLeft>]"),
  });

  await userEvent.click(screen.getByTestId("bold"));
  await userEvent.click(screen.getByTestId("center"));

  await userEvent.click(screen.getByTestId("value").children[0].children[0]);
  await userEvent.keyboard("{home}");

  await expect(screen.getByTestId("value").children[0].innerHTML).toBe(
    '<p style="text-align: center" class="focus"><strong>Testing</strong></p>'
  );
};
