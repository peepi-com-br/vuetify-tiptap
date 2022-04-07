<template>
  <v-dialog :value="dialog" @input="dialog = $event" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ "video" }}</span>

        <v-spacer />

        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="src"
          name="link-video"
          :label="'link'"
          hide-details
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="apply">
          {{ "add" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class RichTextNewVideoDialog extends Vue {
  @Prop() readonly value: string | null;

  src = "";

  dialog = true;

  created() {
    this.src = this.value;
  }

  close() {
    this.dialog = false;
  }

  apply() {
    this.dialog = false;
    this.$emit("input", this.src);
  }
}
</script>
