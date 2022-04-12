export interface PluginOptions {
  uploadImage: (file: File) => Promise<string> | null;
}
