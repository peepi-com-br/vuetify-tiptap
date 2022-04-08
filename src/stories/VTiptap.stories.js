// import the helper!
import { storyFactory } from "~storybook/util/helpers";
// import the component to be tested
import VTiptap from "@/VTiptap.vue";

import testHtml from "@/constants/testHtml";

// set the default properties
export default storyFactory({
  title: "VTiptap",
  component: VTiptap,
  description: "This can be **markdown**!",
  args: {},
});

// create a base template to share
const Template = (args, { argTypes }) => ({
  components: { VTiptap },
  props: Object.keys(argTypes),
  template: '<v-tiptap :value="value" :toolbar="toolbar" />',
});

// now the stories, you need at least one
export const BasicUsage = Template.bind({});

// try one with overridden props
export const CustomToolbar = Template.bind({});
CustomToolbar.args = { toolbar: ["bold", "|", "h1", "p", ">", "clear"] };

export const WithFullText = Template.bind({});
WithFullText.args = { value: testHtml };
