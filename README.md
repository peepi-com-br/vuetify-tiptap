[![Stargazers][stars-shield]][stars-url]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

## vuetify-tiptap

> 🚀 Awesome and extendable rich text editor component for Vuetify projects using tiptap

![Sample](images/sample.png)

<p align="center">
    <a href="#"><strong>View Demo</strong></a>
    ·
    <a href="#usage">Usage</a>
    ·
    <a href="#installation">Installation</a>
    ·
    <a href="#api">API</a>
    ·
    <a href="#license">License</a>
    ·
    <a href="#license">Maintainers</a>
</p>

## Usage

```vue
<v-tiptap v-model="value" />
```

(IMAGEM EXEMPLO)

To ensure full consistency between whats is seen in the editor and what you see when you render the HTML value, the component also has a view mode.

```vue
<v-tiptap v-model="value" view />
```

(IMAGEM EXEMPLO)

The toolbar is fully customizable and you can add, remove or reorder buttons. You can also use slots to add custom buttons with your own functionality.

```vue
<v-tiptap
  v-model="value"
  :toolbar="['bold', 'italic', '|', 'h1', 'p', '>', '#mybutton']"
>
    <template #mybutton="{ editor }">
        <v-btn icon small title="Clear Content" @click="editor.commands.clearContent()">
            <v-icon>mdi-delete-circle-outline</v-icon>
        </v-btn>
    </template>
</v-tiptap>
```

(IMAGEM EXEMPLO)

> ⚠️ This project uses Vue 2 and Vuetify 2. We plan to upgrade to Vue 3 as soon as Vuetify supports it.

## Instalation

## Extending the Toolbar

- Example with custom toolbar

## Add Custom Buttons

- Example with slots

## Props

| Name         | Description | Type                            | Required | Default |
| ------------ | ----------- | ------------------------------- | -------- | ------- |
| value        | -           | `string \| null`                | `false`  | -       |
| placeholder  | -           | `string \| null`                | `false`  | -       |
| view         | -           | `boolean \| string[] \| string` | `false`  | `false` |
| codeEditable | -           | `boolean`                       | `false`  | `false` |
| codeEditor   | -           | `boolean`                       | `false`  | `false` |
| xss          | -           | `boolean`                       | `false`  | `true`  |
| codeLanguage | -           | `string`                        | `false`  | `html`  |
| hideToolbar  | -           | `boolean`                       | `false`  | `false` |
| inline       | -           | `boolean`                       | `false`  | `false` |
| disabled     | -           | `boolean`                       | `false`  | `false` |

## Events

| Event Name | Description | Parameters |
| ---------- | ----------- | ---------- |
| input      | -           | -          |
| enter      | -           | -          |

## Slots

| Name    | Description | Default Slot Content |
| ------- | ----------- | -------------------- |
| prepend | -           | -                    |
| append  | -           | -                    |

## License

## Mantainers

- Ricardo Faust (alkin)
- Atila Silva (atila)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/peepi-com-br/vuetify-tiptap.svg?style=for-the-badge
[contributors-url]: https://github.com/peepi-com-br/vuetify-tiptap/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/peepi-com-br/vuetify-tiptap.svg?style=for-the-badge
[forks-url]: https://github.com/peepi-com-br/vuetify-tiptap/network/members
[stars-shield]: https://img.shields.io/github/stars/peepi-com-br/vuetify-tiptap.svg?style=for-the-badge
[stars-url]: https://github.com/peepi-com-br/vuetify-tiptap/stargazers
[issues-shield]: https://img.shields.io/github/issues/peepi-com-br/vuetify-tiptap.svg?style=for-the-badge
[issues-url]: https://github.com/peepi-com-br/vuetify-tiptap/issues
[license-shield]: https://img.shields.io/github/license/peepi-com-br/vuetify-tiptap.svg?style=for-the-badge
[license-url]: https://github.com/peepi-com-br/vuetify-tiptap/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/company/peepi
[product-screenshot]: images/screenshot.png
