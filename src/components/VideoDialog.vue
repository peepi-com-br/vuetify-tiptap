<template>
  <v-dialog
    :dark="dark"
    :value="show"
    @input="$emit('onClose', $event)"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ "Edit Video" }}</span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          :value="value"
          @input="url = $event"
          name="video-url"
          label="URL"
          hide-details
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="apply">
          {{ "Apply" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() readonly value: string | null;

  @Prop({ default: false }) show: boolean;

  @Prop({ default: false }) dark: boolean;

  url = "";

  apply() {
    this.$emit("onApply", this.url);
    this.$emit("onClose");
  }

  close() {
    this.$emit("onClose");
  }
}
</script>
