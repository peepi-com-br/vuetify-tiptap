<template>
  <v-dialog :value="dialog" @input="dialog = $event" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">
          {{ "Config link" }}
        </span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="url" name="link" label="link" hide-details />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="close">{{ "close" }}</v-btn>
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
export default class RichTextNewLinkDialog extends Vue {
  @Prop() readonly value: string | null;

  url = "";

  dialog = true;

  created() {
    this.url = this.value;
  }

  get isDisabled() {
    return this.value === this.url || (!this.value && !this.url);
  }

  close() {
    this.dialog = false;
  }

  apply() {
    this.dialog = false;
    this.$emit("input", this.url);
  }
}
</script>
