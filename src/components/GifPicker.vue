
<template>
  <v-menu
    v-model="value"
    top
    center
    :nudge-top="18"
    :nudge-left="160"
    absolute
    :close-on-content-click="false"
    :dark="dark"
  >
    <v-card class="mx-auto" max-width="454">
      <v-card-text>
        <v-text-field
          color="primary"
          v-model="search"
          hide-details
          :loading="loading"
          :append-icon="icon('search')"
          placeholder="Search gifs"
        />
      </v-card-text>

      <v-container
        id="scroll-target"
        style="max-height: 300px"
        class="overflow-y-auto"
      >
        <v-row style="">
          <v-col v-for="card in gifs" :key="card.url" :cols="3">
            <v-card
              style="cursor: pointer"
              @click="apply(card.images.preview_gif.url)"
            >
              <v-img
                :src="card.images.preview_gif.url"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="80px"
              >
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { VEmojiPicker } from "v-emoji-picker";
import { GiphyFetch } from "@giphy/js-fetch-api";
import icons from "@/constants/icons";

const gf = new GiphyFetch("1zGh2SOk0IJDYYgaGfXfviswFs31g8CJ");

@Component({
  components: { VEmojiPicker },
})
export default class extends Vue {
  value = false;

  @Prop() readonly activator: any;

  @Prop({ default: false }) readonly dark: boolean;

  absoluteX = 0;

  absoluteY = 0;

  loading = false;

  gifs = [];

  search = "";

  @Watch("search")
  async onSearchChange() {
    console.log(this.gifs);
    this.gifs = (await gf.search(this.search)).data;
  }

  apply(gif) {
    this.$emit("gifSelected", gif);
  }

  icon(icon) {
    return icons.get(icon);
  }

  @Watch("value")
  async onValueChange() {
    this.gifs = (await gf.trending({ limit: 32 })).data;

    if (!this.value) {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>

