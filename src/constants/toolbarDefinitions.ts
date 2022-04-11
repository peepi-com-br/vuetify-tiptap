import icons from './icons'

export default function makeToolbarDefinitions(context) {
  const definitions = {
    // Special items
    "|": { type: "divider" },
    divider: { type: "divider" },
    ">": { type: "spacer" },
    spacer: { type: "spacer" },
    // Standard buttons
    bold: {
      title: "Bold",
      icon: "bold",
      action: () => context.editor.chain().focus().toggleBold().run(),
      isActive: () => context.editor.isActive("bold"),
    },
    italic: {
      title: "Italic",
      icon: "italic",
      action: () => context.editor.chain().focus().toggleItalic().run(),
      isActive: () => context.editor.isActive("italic"),
    },
    underline: {
      title: "Underline",
      icon: "underline",
      action: () => context.editor.chain().focus().toggleUnderline().run(),
      isActive: () => context.editor.isActive("underline"),
    },
    strike: {
      title: "Strike",
      icon: "strike",
      action: () => context.editor.chain().focus().toggleStrike().run(),
      isActive: () => context.editor.isActive("strike"),
    },
    color: {
      title: "Color",
      icon: "color",
      action: (color) => context.editor.chain().focus().setColor(color).run(),
      isActive: () => context.editor.isActive("textStyle"),
    },
    highlight: {
      title: "Highlight",
      icon: "highlight",
      action: () => context.editor.chain().focus().toggleHighlight().run(),
      isActive: () => context.editor.isActive("highlight"),
    },
    headings: { type: "headings" },
    h1: {
      title: "Heading 1",
      icon: "h1",
      action: () =>
        context.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => context.editor.isActive("heading", { level: 1 }),
    },
    h2: {
      title: "Heading 2",
      icon: "h2",
      action: () =>
        context.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => context.editor.isActive("heading", { level: 2 }),
    },
    h3: {
      title: "Heading 3",
      icon: "h3",
      action: () =>
        context.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => context.editor.isActive("heading", { level: 3 }),
    },
    p: {
      title: "Paragraph",
      icon: "p",
      action: () => context.editor.chain().focus().setParagraph().run(),
      isActive: () => context.editor.isActive("paragraph"),
    },
    left: {
      title: "left",
      icon: "left",
      action: () => context.editor.chain().focus().setTextAlign("left").run(),
      isActive: () => context.editor.isActive({ textAlign: "left" }),
    },
    center: {
      title: "center",
      icon: "center",
      action: () => context.editor.chain().focus().setTextAlign("center").run(),
      isActive: () => context.editor.isActive({ textAlign: "center" }),
    },
    right: {
      title: "right",
      icon: "right",
      action: () => context.editor.chain().focus().setTextAlign("right").run(),
      isActive: () => context.editor.isActive({ textAlign: "right" }),
    },
    justify: {
      title: "justify",
      icon: "justify",
      action: () =>
        context.editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => context.editor.isActive({ textAlign: "justify" }),
    },
    bulletList: {
      title: "Bullet List",
      icon: "bulletList",
      action: () => context.editor.chain().focus().toggleBulletList().run(),
      isActive: () => context.editor.isActive("bulletList"),
    },
    orderedList: {
      title: "Ordered List",
      icon: "orderedList",
      action: () => context.editor.chain().focus().toggleOrderedList().run(),
      isActive: () => context.editor.isActive("orderedList"),
    },
    checkbox: {
      title: "Task List",
      icon: "checkbox",
      action: () => context.editor.chain().focus().toggleTaskList().run(),
      isActive: () => context.editor.isActive("taskList"),
    },
    link: {
      title: "Link",
      icon: "link",
      action: context.setLink,
      isActive: () => context.editor.isActive("link"),
    },
    image: {
      title: "Image",
      icon: "image",
      action: context.selectImage,
      isActive: () => context.editor.isActive("image"),
    },
    video: {
      title: "Video",
      icon: "video",
      action: context.setVideo,
      isActive: () => context.editor.isActive("iframe"),
    },
    emoji: {
      title: "Emoji",
      icon: "emoji",
      action: context.setEmoji,
    },
    blockquote: {
      title: "Blockquote",
      icon: "blockquote",
      action: () => context.editor.chain().focus().toggleBlockquote().run(),
      isActive: () => context.editor.isActive("blockquote"),
    },
    rule: {
      title: "Horizontal Rule",
      icon: "rule",
      action: () => context.editor.chain().focus().setHorizontalRule().run(),
    },
    code: {
      title: "Code",
      icon: "code",
      action: () => context.editor.chain().focus().toggleCode().run(),
      isActive: () => context.editor.isActive("code"),
    },
    codeBlock: {
      title: "Code Block",
      icon: "codeBlock",
      action: () => context.editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => context.editor.isActive("codeBlock"),
    },
    clear: {
      title: "Clear Format",
      icon: "clear",
      /* eslint newline-per-chained-call: "off" */
      action: () =>
        context.editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
  };

  let toolbarItems = [];
  for (let i of context.toolbar) {
    if (definitions[i]) {
      definitions[i].icon = icons.get(definitions[i].icon, context.$vuetify.icons.iconfont);
      definitions[i].type = definitions[i].type || i;
      toolbarItems.push(definitions[i]);
    } else if (i[0] === "#") {
      toolbarItems.push({ type: "slot", slot: i.substring(1) });
    }
  }

  return toolbarItems;
}
