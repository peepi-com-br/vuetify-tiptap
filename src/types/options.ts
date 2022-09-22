export interface PluginOptions {
  uploadImage: (file: File) => Promise<string> | null;
  mentionItems: (query: string) => Promise<object[]> | null;
}
