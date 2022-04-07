<template>
  <v-dialog :value="dialog" @input="dialog = $event" max-width="500">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ "image" }}
        </span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- <UploadableImage v-model="src" variant class="mb-4" :uploading.sync="uploading" /> -->

        <slot name="imageComponent" />

        <v-text-field
          v-model="src"
          name="src"
          label="Link URL"
          :placeholder="'image'"
          hide-details
        />
      </v-card-text>

      <v-card-actions>
        <v-btn :loading="uploading" :disabled="uploading" text @click="apply">
          {{ "apply" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import delay from "delay";

@Component
export default class ImageDialog extends Vue {
  @Prop() readonly value: string | null;

  dialog = false;

  uploading = false;

  src = "";

  apply() {
    this.$emit("input", this.src);
    this.dialog = false;
  }

  created() {
    console.log(this.$scopedSlots);
    this.src = this.value;
  }

  close() {
    this.dialog = false;
  }

  @Watch("dialog")
  async onDialogChange() {
    if (!this.dialog) {
      // await delay(500);

      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>
