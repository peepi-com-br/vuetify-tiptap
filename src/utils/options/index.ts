import { PluginOptions } from "@/types/options";

export const DEFAULT_OPTIONS: PluginOptions = {
  uploadImage: null,
  mentionItems: null,
};

export const options = { ...DEFAULT_OPTIONS };

export function mergeOptions(newOptions: Partial<PluginOptions>) {
  Object.assign(options, newOptions);
}

export function getOption<T extends keyof PluginOptions>(
  key: T
): PluginOptions[T] {
  return options[key];
}
