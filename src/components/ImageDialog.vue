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

      <v-card-text v-if="!link">
        <v-list class="pa-0">
          <v-list-item @click="selectFile">
            <v-list-item-avatar>
              <v-avatar
                color="grey lighten-3 mx-auto"
                size="84"
                style="display: block"
              >
                <v-icon size="26">mdi-image</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Upload File</v-list-item-title>
              <v-list-item-subtitle>
                Click to select files to be uploaded
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="link = true">
            <v-list-item-avatar>
              <v-avatar
                color="grey lighten-3 mx-auto"
                size="84"
                style="display: block"
              >
                <v-icon size="26">mdi-link-variant</v-icon>
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>Insert Link</v-list-item-title>
              <v-list-item-subtitle>
                Click to insert image by link
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <input v-show="false" type="file" ref="file" @change="onFileSelected" />
      </v-card-text>
      <template v-else>
        <v-card-text>
          <v-text-field
            :value="value"
            @input="url = $event"
            name="image-url"
            label="URL"
            hide-details
            autofocus
          />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="apply">
            {{ "apply" }}
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadableImage from "./UploadableImage.vue";

@Component({
  components: {
    UploadableImage,
  },
})
export default class extends Vue {
  @Prop() readonly value: string | null;

  @Prop({ default: false }) show: boolean;

  @Prop({ default: false }) dark: boolean;

  @Prop() readonly uploadImage: (f: File) => Promise<string>;

  file = "";

  url = "";

  link = false;

  selectFile() {
    this.$refs.file.click();
  }

  @Watch("show")
  onShow(val: boolean) {
    if (val) {
      this.url = this.value || "";
      this.link = this.url != "";
    }
  }

  apply() {
    this.$emit("apply", this.url);
    this.$emit("close");
  }

  close() {
    this.$emit("close");
  }
}
</script>
