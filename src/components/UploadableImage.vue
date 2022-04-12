<template>
  <v-hover v-slot:default="{ hover }">
    <div @click="selectFile" :style="style" class="uploadable-image">
      <!-- Image -->
      <v-img
        v-if="value"
        :min-height="$attrs['min-height'] || '200px'"
        :max-height="$attrs.height || '370px'"
        :src="value"
        v-bind="{ ...$attrs }"
        class="transparent-background"
        @error="error"
      />
      <div
        v-else
        class="d-flex align-center"
        :style="{ height: $attrs.height || '200px' }"
      >
        <div class="ma-6 mx-auto text-center text--secondary">
          <v-avatar
            color="grey lighten-3 mx-auto"
            size="84"
            style="display: block"
          >
            <v-icon size="46">mdi-image</v-icon>
          </v-avatar>

          <div class="font-weight-medium mt-4">Select Files</div>
          <small>Click to select files</small>
        </div>
      </div>

      <!-- Overlay -->
      <v-fade-transition>
        <v-overlay
          v-if="hover || uploading"
          absolute
          style="z-index: 1; text-align: center"
          :opacity="0.75"
        >
          <template v-if="!uploading">
            <v-icon dark size="46">mdi-cloud-upload</v-icon>
            <div>Send File</div>
            <small
              v-if="value"
              @click.stop.prevent="$emit('input', null)"
              class="text-uppercase"
              style="font-size: 0.7em"
            >
              Remove
            </small>
          </template>
          <v-icon v-else class="mdi-spin">mdi-loading</v-icon>
        </v-overlay>
      </v-fade-transition>

      <!-- File Input -->
      <input v-show="false" type="file" ref="file" @change="onFileSelected" />
    </div>
  </v-hover>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class UploadableImage extends Vue {
  @Prop() readonly value!: string | string[];

  uploading = false;

  selectFile() {
    if (this.uploading) return;

    // @ts-ignore
    this.$refs.file.click();
  }

  error(e) {
    // console.log('ok');
  }

  onFileSelected(e) {
    const { files } = e.target;

    this.uploadFile(files);
  }

  async uploadFile(files: File[]) {
    // this.uploading = true;
    // this.$emit("update:uploading", true);
    // let file = files[0];
    // if (!file) {
    //   this.uploading = false;
    //   return;
    // }
    // const extension = file.name.split(".").pop();
    // file = await optimizeFile(file);
    // const token = await this.$api.files.token(extension);
    // await this.$api.files.store(token.data, file);
    // const value = token.data.url.split("?").shift();
    // this.$emit("input", value);
    // this.uploading = false;
    // this.$emit("update:uploading", false);
  }

  get style() {
    return {
      cursor: "pointer",
      position: "relative",
      border: "2px dashed #DDD",
      maxWidth: this.$attrs["max-width"] || "400px",
      minHeight: "100px",
    };
  }
}
</script>

<style lang="scss">
.uploadable-image {
  .variant {
    border: 2px dashed #ddd;
  }

  .transparent-background {
    background-image: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.95),
        rgba(255, 255, 255, 0.95)
      ),
      linear-gradient(to right, black 50%, white 50%),
      linear-gradient(to bottom, black 50%, white 50%);
    background-blend-mode: normal, difference, normal;
    background-size: 2em 2em;
    background-repeat: repeat;
  }
}
</style>
