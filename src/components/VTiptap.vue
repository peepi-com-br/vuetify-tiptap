<template>
  <div class="main">
    <v-input
      class="v-tiptap"
      :messages="['Messages']"
      append-icon="mdi-close"
      prepend-icon="mdi-phone"
    >
      Default Slot
    </v-input>
  </div>
</template>

<script lang="ts">
import { VInput } from "vuetify/lib";

export default {
  name: "VTiptap",
  components: { VInput },
};
</script>

<style scoped>
.main {
  padding: 10%;
  height: auto;
  background: hsl(240deg 8% 93%);
}

.v-tiptap {
  background: white;
  padding: 15px;
}
</style>
