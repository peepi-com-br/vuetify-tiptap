<template>
  <v-dialog
    :dark="dark"
    :value="show"
    @input="$emit('close', $event)"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ "Edit Image" }}
        </span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="url"
          filled
          name="url"
          label="Link"
          hide-details
          autofocus
          prepend-icon="mdi-link-variant"
          class="mb-2"
          :disabled="file || loading"
        />

        <div class="text-overline text-center my-2">OR</div>

        <v-file-input
          v-if="uploadImage"
          v-model="file"
          filled
          label="File"
          accept="image/png, image/jpeg, image/bmp, image/gif"
          hide-details
          @change="onFileSelected"
          @click:clear="url = ''"
          :loading="loading"
          :disabled="loading"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="apply" :disabled="url == '' || loading">
          {{ "apply" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() readonly value: string | null;

  @Prop({ default: false }) show: boolean;

  @Prop({ default: false }) dark: boolean;

  @Prop() readonly uploadImage: (file: File) => Promise<string>;

  url = "";

  file = null;

  loading = false;

  async onFileSelected(file) {
    if (!file) return;

    try {
      this.loading = true;
      this.url = await this.uploadImage(file);
    } finally {
      this.loading = false;
    }
  }

  @Watch("show")
  onShow(val: boolean) {
    if (val) {
      this.url = this.value || "";
    }
  }

  apply() {
    this.$emit("apply", this.url);

    this.file = null;
    this.url = "";

    this.$emit("close");
  }

  close() {
    this.$emit("close");
  }
}
</script>

<style lang="scss">
</style>
