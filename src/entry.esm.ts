import { PluginOptions } from "@/types/options";
import { mergeOptions } from "@/utils/options";
import { PluginFunction } from "vue";

import VTiptap from "@/components/VTiptap.vue";

const install: PluginFunction<PluginOptions> = (Vue, options?) => {
  mergeOptions(options || {});

  Vue.component("VTiptap", VTiptap);
};

export { VTiptap };

export default install;
