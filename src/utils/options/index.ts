import { MessageOptions, PluginOptions } from "@/types/options";

export const DEFAULT_OPTIONS: PluginOptions = {
  label: "Phone",
  ariaLabel: undefined,
  countryLabel: "Country",
  countryAriaLabel: (options: MessageOptions) => `Country for ${options.label}`,
  placeholder: undefined,
  hint: undefined,
  invalidMessage: (options: MessageOptions) =>
    `The "${options.label}" field is not a valid phone number (example: ${options.example}).`,
  persistentPlaceholder: undefined,
  persistentHint: undefined,
  countryIconMode: undefined,
  disableGuessingCountry: false,
  disableGuessLoading: false,
  enableSearchingCountry: false,
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
