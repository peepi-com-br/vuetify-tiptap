import VTiptap from "./VTiptap.vue";

let installed = false;

export function install(Vue) {
  if (installed) return;
  installed = true;
  Vue.component("VTiptap", VTiptap);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default VTiptap;
