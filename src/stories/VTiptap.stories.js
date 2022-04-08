// import the helper!
import { storyFactory } from "~storybook/util/helpers";
// import the component to be tested
import VTiptap from "@/components/VTiptap.vue";

// set the default properties
export default storyFactory({
  title: "VTiptap",
  component: VTiptap,
  description: "This can be **markdown**!",
  args: {
    // these will become controls
    prop1: "val 1",
    prop2: 42,
  },
});

// create a base template to share
const Template = (args, { argTypes }) => ({
  components: { VTiptap },
  props: Object.keys(argTypes),
  template: '<v-tiptap :prop1="prop1" :prop2="prop2" />',
});

// now the stories, you need at least one
export const Default = Template.bind({});

// try one with overridden props
export const Secondary = Template.bind({});
Secondary.args = { prop1: "some other val" };
