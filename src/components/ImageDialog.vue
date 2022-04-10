<template>
  <v-dialog :dark="dark" :value="show" @input="$emit('close', $event)" max-width="500">
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
          <v-text-field v-model="value" name="src" label="URL" hide-details />
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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() readonly value: boolean | null;

  @Prop({ default: false }) show: boolean;

  @Prop({ default: false }) dark: boolean;

  apply() {
    this.$emit("input", this.value);
    this.$emit("close", false);
  }

  close() {
    this.$emit("close", false);
  }
}
</script>
