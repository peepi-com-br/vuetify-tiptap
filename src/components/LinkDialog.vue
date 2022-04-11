<template>
  <v-dialog
    :dark="dark"
    :value="dialog"
    @input="dialog = $event"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ __("dialogs.link.title") }}
        </span>

        <v-spacer />

        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="url" name="url" label="URL" hide-details />
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="isDisabled" text @click="apply">
          {{ __("apply") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import i18n from "@/mixins/i18n";

@Component
export default class extends mixins(i18n) {
  @Prop() readonly value: string | null = null;

  @Prop({ default: false }) readonly dark: boolean;

  url = "";

  dialog = true;

  created() {
    this.url = this.value;
  }

  get isDisabled() {
    return this.value === this.url || (!this.value && !this.url);
  }

  apply() {
    this.dialog = false;
    this.$emit("input", this.url);
  }
}
</script>
