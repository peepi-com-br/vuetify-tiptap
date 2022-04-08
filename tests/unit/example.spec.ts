import { shallowMount } from "@vue/test-utils";
import VTiptap from "@/VTiptap.vue";

describe("VTiptap.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(VTiptap, {
      propsData: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
