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
        <slot name="image">
          <v-text-field
            :value="value"
            @input="url = $event"
            name="image-url"
            label="URL"
            hide-details
          />
        </slot>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="apply">
          {{ "apply" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() readonly value: string | null;

  @Prop({ default: false }) show: boolean;

  @Prop({ default: false }) dark: boolean;

  url = "";

  apply() {
    this.$emit("apply", this.url);
    this.$emit("close");
  }

  close() {
    this.$emit("close");
  }
}
</script>
