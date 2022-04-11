import Vue from 'vue'
import locales from '@/locale'
import { Component } from 'vue-property-decorator'

@Component
export default class I18n extends Vue {
    __(key: string) {
        const getValue = (object, keys) => keys.split('.').reduce((o, k) => (o || {})[k], object);

        return getValue(locales[this.$vuetify.lang.current], key) || key
    }
}
