export interface PluginOptions {
  uploadImage: (file: File) => Promise<string> | null;
  mentionItems: (items: object[]) => Promise<object[]> | null;
}
