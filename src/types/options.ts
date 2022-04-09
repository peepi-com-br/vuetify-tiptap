import { VueConstructor } from "vue";

export type CountryIconMode = "svg" | "sprite" | VueConstructor | undefined;

export type Message = string | undefined | null;

export interface MessageOptions {
  label?: Message;
  example: string;
}

export type MessageResolver = ((options: MessageOptions) => Message) | Message;

export interface PluginOptions {
  label: MessageResolver;
  ariaLabel: MessageResolver;
  countryLabel: MessageResolver;
  countryAriaLabel: MessageResolver;
  placeholder: MessageResolver;
  hint: MessageResolver;
  invalidMessage: MessageResolver;
  persistentPlaceholder: boolean | undefined;
  persistentHint: boolean | undefined;
  countryIconMode: CountryIconMode;
  disableGuessingCountry: boolean;
  disableGuessLoading: boolean;
  enableSearchingCountry: boolean;
}
