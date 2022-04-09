<template>
  <v-menu
    v-model="menu"
    offset-y
    :dark="dark"
    :nudge-left="nudgeLeft || 255"
    :nudge-top="nudgeTop || 42"
    :close-on-content-click="false"
    transition="scale-transition"
    :origin="!nudgeLeft ? 'top right' : 'top left'"
  >
    <template #activator="{ on }">
      <slot name="button" v-bind="{ on }">
        <v-btn
          :color="value"
          v-on="on"
          icon
          small
          style="border: 1px solid rgba(0, 0, 0, 0.25) !important; top: -2px"
        >
          <v-icon>mdi-circle</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-list class="pa-0">
      <v-container fluid style="padding-bottom: 0">
        <div class="d-flex flex-wrap" style="max-width: 274px">
          <div
            v-for="color in colors"
            :key="color"
            class="text-center"
            style="width: 12.5%"
          >
            <v-btn icon small @click="setColor(color)">
              <v-icon :color="color">mdi-circle</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>

      <v-divider horizontal class="mt-2" />
      <template v-if="more">
        <v-btn
          v-if="!picker"
          style="margin: 1rem 0 0 0; height: auto"
          x-small
          block
          text
          @click.stop.prevent="picker = true"
          class="ma-0 py-3"
        >
          {{ __("words.show-more") }}
        </v-btn>
        <v-btn
          v-else
          style="margin: 1rem 0 0 0; height: auto"
          x-small
          block
          text
          @click.stop.prevent="picker = false"
          class="ma-0 py-3"
        >
          {{ __("words.show-less") }}
        </v-btn>

        <v-expand-transition>
          <div v-if="picker" class="text-center">
            <v-divider />
            <v-color-picker
              :value="value"
              @input="$emit('input', $event)"
              width="300"
            />
          </div>
        </v-expand-transition>
      </template>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() readonly value;

  @Prop({ default: 0 }) readonly nudgeLeft: string | number;

  @Prop({ default: 0 }) readonly nudgeTop: string | number;

  @Prop({ default: true }) readonly more: boolean;

  @Prop({ default: false }) readonly dark: boolean;

  menu = false;

  colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
     "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
    "#D5D5D4",
    "#E8E8E8",
    "#EEEEEE",
  ];

  picker = false;

  setColor(color) {
    this.$emit("input", color);
    this.menu = false;
  }
}
</script>
