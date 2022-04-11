export function renderSuggestion(component) {
  return () => {
    const { mention } = component;

    return {
      onStart: props => {
        mention.show = true;
        mention.items = props.items;
        mention.command = props.command;
        mention.selected = 0;

        const { x, y } = props.clientRect();
        mention.x = x;
        mention.y = y + 24;
      },

      onUpdate(props) {
        mention.items = props.items;
      },

      onKeyDown(props) {
        const { event } = props;

        if (event.key === "Escape") {
          mention.show = false;

          return true;
        }

        if (event.key === "ArrowUp") {
          mention.selected =
            (mention.selected + mention.items.length - 1) %
            mention.items.length;

          return true;
        }

        if (event.key === "ArrowDown") {
          mention.selected = (mention.selected + 1) % mention.items.length;

          return true;
        }

        if (event.key === "Enter") {
          component.selectMention(mention.selected);

          return true;
        }

        return false;
      },

      onExit() {
        mention.show = false;
      },
    };
  };
}
