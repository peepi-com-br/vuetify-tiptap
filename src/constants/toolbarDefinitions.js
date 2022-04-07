export default function toolbarDefinitions(context) {
  const definitions = {
    "|": { type: "divider" },
    divider: { type: "divider" },
    ">": { type: "spacer" },
    spacer: { type: "spacer" },
    bold: {
      title: "Bold",
      icon: "mdi-format-bold",
      action: () => context.editor.chain().focus().toggleBold().run(),
      isActive: () => context.editor.isActive("bold"),
    },
    italic: {
      title: "Italic",
      icon: "mdi-format-italic",
      action: () => context.editor.chain().focus().toggleItalic().run(),
      isActive: () => context.editor.isActive("italic"),
    },
    underline: {
      title: "Underline",
      icon: "mdi-format-underline",
      action: () => context.editor.chain().focus().toggleUnderline().run(),
      isActive: () => context.editor.isActive("underline"),
    },
    strike: {
      title: "Strike",
      icon: "mdi-format-strikethrough",
      action: () => context.editor.chain().focus().toggleStrike().run(),
      isActive: () => context.editor.isActive("strike"),
    },
    color: {
      title: "Color",
      icon: "mdi-palette",
      action: (color) => context.editor.chain().focus().setColor(color).run(),
      isActive: () => context.editor.isActive("textStyle"),
    },
    highlight: {
      title: "Highlight",
      icon: "mdi-grease-pencil",
      action: () => context.editor.chain().focus().toggleHighlight().run(),
      isActive: () => context.editor.isActive("highlight"),
    },
    headings: { type: "headings" },
    h1: {
      title: "Heading 1",
      icon: "mdi-format-header-1",
      action: () =>
        context.editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => context.editor.isActive("heading", { level: 1 }),
    },
    h2: {
      title: "Heading 2",
      icon: "mdi-format-header-2",
      action: () =>
        context.editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => context.editor.isActive("heading", { level: 2 }),
    },
    h3: {
      title: "Heading 3",
      icon: "mdi-format-header-3",
      action: () =>
        context.editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => context.editor.isActive("heading", { level: 3 }),
    },
    p: {
      title: "Paragraph",
      icon: "mdi-format-paragraph",
      action: () => context.editor.chain().focus().setParagraph().run(),
      isActive: () => context.editor.isActive("paragraph"),
    },
    left: {
      title: "left",
      icon: "mdi-format-align-left",
      action: () => context.editor.chain().focus().setTextAlign("left").run(),
      isActive: () => context.editor.isActive({ textAlign: "left" }),
    },
    center: {
      title: "center",
      icon: "mdi-format-align-center",
      action: () => context.editor.chain().focus().setTextAlign("center").run(),
      isActive: () => context.editor.isActive({ textAlign: "center" }),
    },
    right: {
      title: "right",
      icon: "mdi-format-align-right",
      action: () => context.editor.chain().focus().setTextAlign("right").run(),
      isActive: () => context.editor.isActive({ textAlign: "right" }),
    },
    justify: {
      title: "justify",
      icon: "mdi-format-align-justify",
      action: () =>
        context.editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => context.editor.isActive({ textAlign: "justify" }),
    },
    bulletList: {
      title: "Bullet List",
      icon: "mdi-format-list-bulleted-square",
      action: () => context.editor.chain().focus().toggleBulletList().run(),
      isActive: () => context.editor.isActive("bulletList"),
    },
    orderedList: {
      icon: "mdi-format-list-numbered",
      title: "Ordered List",
      action: () => context.editor.chain().focus().toggleOrderedList().run(),
      isActive: () => context.editor.isActive("orderedList"),
    },
    checkbox: {
      icon: "mdi-format-list-checkbox",
      title: "Task List",
      action: () => context.editor.chain().focus().toggleTaskList().run(),
      isActive: () => context.editor.isActive("taskList"),
    },
    link: {
      title: "Link",
      icon: "mdi-link-variant",
      action: context.setLink,
      isActive: () => context.editor.isActive("link"),
    },
    image: {
      icon: "mdi-image",
      title: "Image",
      action: context.selectImage,
      isActive: () => context.editor.isActive("image"),
    },
    video: {
      icon: "mdi-video",
      title: "Video",
      action: context.setVideo,
      isActive: () => context.editor.isActive("iframe"),
    },
    emoji: {
      icon: "mdi-emoticon-outline",
      title: "Emoji",
      action: context.setEmoji,
    },
    blockquote: {
      icon: "mdi-format-quote-open",
      title: "Blockquote",
      action: () => context.editor.chain().focus().toggleBlockquote().run(),
      isActive: () => context.editor.isActive("blockquote"),
    },
    rule: {
      icon: "mdi-minus",
      title: "Horizontal Rule",
      action: () => context.editor.chain().focus().setHorizontalRule().run(),
    },
    code: {
      title: "Code",
      icon: "mdi-code-tags",
      action: () => context.editor.chain().focus().toggleCode().run(),
      isActive: () => context.editor.isActive("code"),
    },
    codeBlock: {
      icon: "mdi-code-braces-box",
      title: "Code Block",
      action: () => context.editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => context.editor.isActive("codeBlock"),
    },
    clear: {
      icon: "mdi-format-clear",
      title: "Clear Format",
      /* eslint newline-per-chained-call: "off" */
      action: () =>
        context.editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
  };

  let toolbarItems = [];
  for (let i of context.toolbar) {
    if (definitions[i]) {
      toolbarItems.push(definitions[i]);
    } else if (i[0] === "#") {
      toolbarItems.push({ type: "slot", slot: i.substring(1) });
    }
  }

  return toolbarItems;
}
