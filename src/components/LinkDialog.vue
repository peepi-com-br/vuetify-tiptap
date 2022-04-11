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
          {{ "Edit Link" }}
        </span>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          :value="value"
          @input="url = $event"
          name="link-url"
          label="URL"
          hide-details
        />
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="isDisabled" text @click="apply">
          {{ "apply" }}
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

  get isDisabled() {
    return this.value === this.url || (!this.value && !this.url);
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
