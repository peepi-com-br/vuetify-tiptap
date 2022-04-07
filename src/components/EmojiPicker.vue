<template>
  <v-menu
    v-model="value"
    top
    center
    :nudge-top="18"
    :nudge-left="160"
    absolute
    :close-on-content-click="false"
  >
    <VEmojiPicker
      :labelSearch="'search'"
      emojisByRow="10"
      emojiSize="25"
      lang="pt-BR"
      @select="apply"
    />
  </v-menu>
</template>

<script lang="ts">
// import delay from "delay";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { VEmojiPicker } from "v-emoji-picker";

@Component({
  components: { VEmojiPicker },
})
export default class EmojiPicker extends Vue {
  value = false;

  @Prop() readonly activator!: any;

  absoluteX = 0;

  absoluteY = 0;

  apply(emoji) {
    this.$emit("emojiSelected", emoji.data);
  }

  @Watch("value")
  async onValueChange() {
    if (!this.value) {
      //await delay(500);

      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>

<style lang="scss">
.emoji-picker {
  .container-emoji {
    height: 150px !important;
    &::after {
      content: " ";
      background: linear-gradient(
        rgba(240, 240, 240, 0),
        rgb(240, 240, 240, 0.75),
        rgb(240, 240, 240)
      );
      position: absolute;
      bottom: 0px;
      height: 24px;
      left: 0;
      right: 0;
    }

    &::-webkit-scrollbar {
      width: 8px !important;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #888;
    }
  }

  .container-search {
    padding: 0 4px !important;
  }
}
</style>
